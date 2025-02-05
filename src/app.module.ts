import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { SessionsService } from './sessions/sessions.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PoliciesModule } from './policies/policies.module';
import { BullModule } from '@nestjs/bullmq';
import { ResendModule } from './resend/resend.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PoliciesModule,
    BullModule.forRoot({
      connection: {
        url: process.env.KV_URL,
      },
    }),
    ResendModule,
  ],
  controllers: [AppController, OrganizationsController],
  providers: [AppService, DbService, SessionsService, OrganizationsService],
})
export class AppModule {}
