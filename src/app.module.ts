import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './database/db/db.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DbModule } from './database/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [AppController, UsersController],
  providers: [AppService, DbService, UsersService],
})
export class AppModule {}
