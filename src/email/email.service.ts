import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from = process.env.EMAIL_FROM ?? 'IIT Alumni <no-reply@iit.org>';
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[dev email] Password reset link for ${to}: ${resetUrl}`);
      return;
    }
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your IIT Alumni password',
      html: `<p>Click the link below to reset your password. This link expires in 24 hours.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }
}
