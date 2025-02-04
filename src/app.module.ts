import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { UsersController } from './auth/auth.controller';
import { UsersService } from './auth/auth.service';
import { ConnectionModule } from './database/connections/postgres.module';
import { SessionsService } from './sessions/sessions.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
import { RedisModule } from './database/connections/redis.module';
@Module({
  imports: [ConnectionModule, RedisModule],
  controllers: [AppController, UsersController, OrganizationsController],
  providers: [
    AppService,
    DbService,
    UsersService,
    SessionsService,
    OrganizationsService,
  ],
})
export class AppModule {}
