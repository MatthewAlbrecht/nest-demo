import { Module } from '@nestjs/common';
import { EnforcerService } from './enforcer.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { PostgresModule } from 'src/database/connections/postgres.module';
import { RedisModule } from 'src/database/connections/redis.module';
import { SessionsService } from 'src/sessions/sessions.service';
import { DbService } from 'src/database/db/db.service';

@Module({
  imports: [PostgresModule, RedisModule],
  providers: [
    EnforcerService,
    AuthService,
    AuthGuard,
    SessionsService,
    DbService,
  ],
  controllers: [AuthController],
  exports: [EnforcerService, AuthService, AuthGuard],
})
export class AuthModule {}
