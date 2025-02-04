import { HttpStatus, HttpException, Inject, Injectable } from '@nestjs/common';
import { eq, gte, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/database/db/db.schema';
import { sessions, users } from 'src/database/db/db.schema';
import * as crypto from 'crypto';

@Injectable()
export class SessionsService {
  constructor(@Inject('DB') private db: PostgresJsDatabase<typeof schema>) {}

  async createSessionForUser(userId: number) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + THIRTY_DAYS);

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.invalidateActiveSession(user.id);

    await this.db.insert(sessions).values({
      userId: user.id,
      sessionId,
      expiresAt,
    });

    return sessionId;
  }

  async invalidateActiveSession(userId: number) {
    const activeSession = await this.getActiveSessionsForUser(userId);

    if (activeSession) {
      await this.db
        .update(sessions)
        .set({ invalidatedAt: new Date() })
        .where(eq(sessions.sessionId, activeSession.sessionId));
    }
  }

  async getActiveSessionsForUser(userId: number) {
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          isNull(sessions.invalidatedAt),
          gte(sessions.expiresAt, new Date()),
        ),
      );

    return session;
  }
}

const THIRTY_DAYS = 1_000 * 60 * 60 * 24 * 30;
