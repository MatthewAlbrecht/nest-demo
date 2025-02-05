import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PostgresModule } from 'src/database/connections/postgres.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PostgresModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
