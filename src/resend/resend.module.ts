import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ResendService } from './resend.service';
import { ResendProcessor } from './resend.processor';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'send-email',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      {
        connection: {
          url: process.env.KV_URL,
        },
      },
    ),
  ],
  providers: [ResendService, ResendProcessor],
  exports: [BullModule],
})
export class ResendModule {}
