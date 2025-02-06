import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ResendService } from 'src/resend/resend.service';
import { CreateEmailOptions } from 'resend';

@Processor('send-email')
@Injectable()
export class ResendProcessor extends WorkerHost {
  private readonly logger = new Logger(ResendProcessor.name);
  private readonly maxAttempts = 3; // Prevent infinite retries

  constructor(private readonly resendService: ResendService) {
    super();
  }

  async process(job: Job<CreateEmailOptions>): Promise<void> {
    const { data } = job;
    if (job.attemptsMade && job.attemptsMade >= this.maxAttempts) {
      this.logger.error(
        `Max attempts reached for ${data.to.toString()}. Aborting job.`,
      );
      return;
    }
    try {
      await this.resendService.sendEmail(data);
      this.logger.log(`Email sent to ${data.to.toString()}`);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Failed to send confirmation email to ${data.to.toString()}: ${err.message}`,
      );
      throw err;
    }
  }
}
