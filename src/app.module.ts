import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ConnectionModule } from './database/connection/connection.module';
@Module({
  imports: [ConnectionModule],
  controllers: [AppController, UsersController],
  providers: [AppService, DbService, UsersService],
})
export class AppModule {}
