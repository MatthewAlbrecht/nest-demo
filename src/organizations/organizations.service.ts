import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { organizations } from 'src/database/db/db.schema';
import * as schema from 'src/database/db/db.schema';

@Injectable()
export class OrganizationsService {
  constructor(@Inject('DB') private db: PostgresJsDatabase<typeof schema>) {}

  async getOrganizations() {
    return this.db.select().from(organizations);
  }
}
