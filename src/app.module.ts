import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { SessionsService } from './sessions/sessions.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, OrganizationsController],
  providers: [AppService, DbService, SessionsService, OrganizationsService],
})
export class AppModule {}
