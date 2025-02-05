import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ResendService } from './resend.service';
import { ResendProcessor } from './resend.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'send-email' }), // Registers the "email" queue
  ],
  providers: [ResendService, ResendProcessor],
  exports: [ResendService],
})
export class ResendModule {}
