import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq, gte, and } from 'drizzle-orm';
import { userAttributes, users } from 'src/database/db/db.schema';
import { SignupUserDto } from './dto/signup-user-dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/database/db/db.schema';
import { DbService } from 'src/database/db/db.service';
import { LoginUserDto } from './dto/login-user-dto';
import { SessionsService } from 'src/sessions/sessions.service';
import defaultUserAttributes from './attributes/default-user-attributes';
import * as crypto from 'crypto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ResendService } from 'src/resend/resend.service';

/**
 * Service handling user operations.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('DB') private db: PostgresJsDatabase<typeof schema>,
    @InjectQueue('send-email') private sendEmailQueue: Queue,
    private dbService: DbService,
    private sessionsService: SessionsService,
    private resendService: ResendService,
  ) {}

  /**
   * Creates a new user with a hashed password.
   * @param param0 - Object with email and password.
   * @returns The created user and session id.
   */
  async signupUser({ email, password }: SignupUserDto) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + THREE_DAYS_IN_MS,
    );

    try {
      var createdUser = await this.db.transaction(async (tx) => {
        var [tempCreatedUser] = await tx
          .insert(users)
          .values({
            email,
            password: hashedPassword,
            emailVerificationToken,
            emailVerificationTokenExpiresAt,
          })
          .returning();
        await tx.insert(userAttributes).values(
          Object.entries(defaultUserAttributes).map(([key, value]) => ({
            userId: tempCreatedUser.id,
            attributeKey: key,
            attributeValue: value,
          })),
        );
        return tempCreatedUser;
      });
    } catch (error) {
      this.dbService.handleDbError(error, {
        [DbService.ERROR_CODES.UNIQUE_VIOLATION]: {
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused_password, ...userWithoutPassword } = createdUser;

    await this.sendEmailQueue.add(
      'send-email',
      this.resendService.getEmailVerificationEmail({
        to: email,
        token: emailVerificationToken,
      }),
    );

    return {
      user: userWithoutPassword,
    };
  }

  /**
   * Logs in a user with the provided email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The logged in user and session id.
   */
  async loginUser({ email, password }: LoginUserDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    var sessionId = await this.sessionsService.createSessionForUser(user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused_password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      sessionId,
    };
  }

  async verifyEmail(token: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token));

    if (!user) {
      return { success: false };
    }

    if (
      user.emailVerificationTokenExpiresAt &&
      user.emailVerificationTokenExpiresAt < new Date()
    ) {
      return { success: false };
    }

    if (user.isEmailVerified) {
      return { success: true };
    }

    try {
      await this.db
        .update(users)
        .set({ isEmailVerified: true })
        .where(eq(users.id, user.id));
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }

    return { success: true };
  }

  addUserAttributes(userId: number, attributes: Record<string, string>) {
    return this.db.insert(userAttributes).values(
      Object.entries(attributes).map(([key, value]) => ({
        userId,
        attributeKey: key,
        attributeValue: value,
      })),
    );
  }
}

const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
const SALT_ROUNDS = 10;
