import { Module, Global } from '@nestjs/common';
import { EnforcerService } from './enforcer.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SessionsService } from 'src/sessions/sessions.service';
import { ResendService } from 'src/resend/resend.service';
import { ResendModule } from 'src/resend/resend.module';
@Global()
@Module({
  imports: [ResendModule],
  providers: [
    EnforcerService,
    AuthService,
    AuthGuard,
    SessionsService,
    ResendService,
  ],
  controllers: [AuthController],
  exports: [AuthGuard, EnforcerService],
})
export class AuthModule {}
