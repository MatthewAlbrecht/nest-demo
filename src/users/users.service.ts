import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { users } from 'src/database/db/db.schema';
import { CreateUserDto } from './users.controller';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/database/db/db.schema';

/** Default salt rounds for password hashing */
const SALT_ROUNDS = 10;

/**
 * Service handling user operations.
 */
@Injectable()
export class UsersService {
  constructor(@Inject('DB') private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Creates a new user with a hashed password.
   * @param param0 - Object with email and password.
   * @returns The created user.
   */
  async signupUser({ email, password }: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await this.db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    return createdUser;
  }
}
