import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from 'src/database/db/db.schema';
import { SignupUserDto } from './dto/signup-user-dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/database/db/db.schema';
import { DbService } from 'src/database/db/db.service';
import { LoginUserDto } from './dto/login-user-dto';
import { SessionsService } from 'src/sessions/sessions.service';

/** Default salt rounds for password hashing */
const SALT_ROUNDS = 10;

/**
 * Service handling user operations.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject('DB') private db: PostgresJsDatabase<typeof schema>,
    private dbService: DbService,
    private sessionsService: SessionsService,
  ) {}

  /**
   * Creates a new user with a hashed password.
   * @param param0 - Object with email and password.
   * @returns The created user.
   */
  async signupUser({ email, password }: SignupUserDto) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      var [createdUser] = await this.db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
        })
        .returning();
    } catch (error) {
      this.dbService.handleDbError(error, {
        [DbService.ERROR_CODES.UNIQUE_VIOLATION]: {
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
        },
      });
    }

    try {
      var sessionId = await this.sessionsService.createSessionForUser(
        createdUser.id,
      );
    } catch (error) {
      this.dbService.handleDbError(error, {
        [DbService.ERROR_CODES.UNIQUE_VIOLATION]: {
          message: 'Session already exists',
          status: HttpStatus.CONFLICT,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused_password, ...userWithoutPassword } = createdUser;

    return {
      user: userWithoutPassword,
      sessionId,
    };
  }

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
}
