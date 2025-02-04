import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { organizations } from 'src/database/db/db.schema';
import * as schema from 'src/database/db/db.schema';
import { CreateOrganizationDto } from './dto/create-organization-dto';

@Injectable()
export class OrganizationsService {
  constructor(@Inject('DB') private db: PostgresJsDatabase<typeof schema>) {}

  async getOrganizations() {
    return this.db.select().from(organizations);
  }

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const [organization] = await this.db
      .insert(organizations)
      .values({
        name: createOrganizationDto.name,
      })
      .returning();

    return organization;
  }
}
