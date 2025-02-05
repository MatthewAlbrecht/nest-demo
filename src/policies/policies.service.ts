import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/database/connections/postgres.module';
import { policies } from 'src/database/db/db.schema';
import { AddPolicyDto } from './dto/add-policy-dto';

@Injectable()
export class PoliciesService {
  async addPolicy(addPolicyDto: AddPolicyDto) {
    if (addPolicyDto.effect !== 'allow' && addPolicyDto.effect !== 'deny') {
      throw new HttpException(
        'Effect must be either allow or deny',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [policy] = await db.insert(policies).values(addPolicyDto).returning();

    return policy;
  }

  async getPolicies() {
    return await db.select().from(policies);
  }
}
