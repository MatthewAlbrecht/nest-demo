import { Injectable, Logger, Global } from '@nestjs/common';
import { CreateEmailOptions, Resend } from 'resend';
import { config } from 'dotenv';

config({ path: '.env' });

@Global()
@Injectable()
export class ResendService {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendService.name);
  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    this.resend = new Resend(apiKey);
  }

  async sendEmail(content: CreateEmailOptions): Promise<any> {
    try {
      return await this.resend.emails.send(content);
      this.logger.log(`Email sent to ${content.to.toString()}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email`, error);
      throw error;
    }
  }

  getEmailVerificationEmail({ to, token }: { to: string; token: string }) {
    const html = `Click <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">here</a> to verify your email`;
    return {
      from: 'hello@record-clubs.com',
      to,
      subject: 'Verify your email',
      html,
    };
  }
}
