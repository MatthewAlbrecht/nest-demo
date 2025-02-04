import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ConnectionModule } from './database/connection/connection.module';
import { SessionsService } from './sessions/sessions.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
@Module({
  imports: [ConnectionModule],
  controllers: [AppController, UsersController, OrganizationsController],
  providers: [AppService, DbService, UsersService, SessionsService, OrganizationsService],
})
export class AppModule {}
