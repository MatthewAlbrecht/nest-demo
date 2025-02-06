import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PoliciesModule } from './policies/policies.module';
import { BullModule } from '@nestjs/bullmq';
import { ResendModule } from './resend/resend.module';
import { DbModule } from './database/db/db.module';
import { PostgresModule } from './database/connections/postgres.module';
import { RedisModule } from './database/connections/redis.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    PostgresModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PoliciesModule,
    DbModule,
    OrganizationsModule,
    BullModule.forRoot({
      connection: {
        url: process.env.KV_URL,
      },
    }),
    ResendModule,
  ],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
