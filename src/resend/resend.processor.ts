import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ResendService } from 'src/resend/resend.service';
import { CreateEmailOptions } from 'resend';

@Processor('send-email')
@Injectable()
export class ResendProcessor extends WorkerHost {
  private readonly logger = new Logger(ResendProcessor.name);

  constructor(private readonly resendService: ResendService) {
    super();
  }
  async process(job: Job<CreateEmailOptions>): Promise<void> {
    const { data } = job;
    try {
      await this.resendService.sendEmail(data);
      this.logger.log(`Email sent to ${data.to.toString()}`);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to send confirmation email: ${err.message}`);
      throw err;
    }
  }
}
