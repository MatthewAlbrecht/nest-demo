import { Injectable } from '@nestjs/common';
import { db } from 'src/database/connections/postgres.module';
import { userAttributes } from 'src/database/db/db.schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class UsersService {
  async addUserAttributes(
    userId: number,
    attributes: Record<string, string>,
  ): Promise<void> {
    const updates = Object.entries(attributes).map(([key, value]) => ({
      userId,
      attributeKey: key,
      attributeValue: value,
    }));
    await db.insert(userAttributes).values(updates);
  }

  async getUserAttributes(userId: number) {
    const attributes = await db
      .select()
      .from(userAttributes)
      .where(eq(userAttributes.userId, userId));
    return attributes.reduce((acc, attr) => {
      acc[attr.attributeKey] = attr.attributeValue;
      return acc;
    }, {});
  }
}
