import { Module } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { PostgresModule } from 'src/database/connections/postgres.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PostgresModule, AuthModule],
  controllers: [PoliciesController],
  providers: [PoliciesService],
})
export class PoliciesModule {}
