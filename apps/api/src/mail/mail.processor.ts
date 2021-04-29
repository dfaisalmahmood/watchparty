import { MailerService } from "@nestjs-modules/mailer";
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { queueNames } from "@watchparty/core";
import { Job } from "bull";
import { plainToClass } from "class-transformer";
import { config } from "winston";
import { User } from "../users/entities/user.entity";
import { MailTypes } from "./mail-types.enum";

@Processor(queueNames.MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(MailTypes.Verification)
  async sendWelcomeEmail(job: Job<{ user: User; code: string }>): Promise<any> {
    this.logger.log(`Sending confirmation email to ${job.data.user.email}`);

    const url = `${this.config.get("clientOrigin")}/auth/verify?token=${
      job.data.code
    }`;

    // if (!this.config.get<boolean>("mail.live")) {
    //   return "SENT MOCK CONFIRMATION EMAIL";
    // }

    try {
      const result = await this.mailerService.sendMail({
        template: `./${MailTypes.Verification}`,
        context: {
          ...plainToClass(User, job.data.user),
          url: url,
        },
        subject: `Welcome to ${this.config.get(
          "appName",
        )}! Please Confirm Your Email Address`,
        to: job.data.user.email,
      });
      return result;
    } catch (err) {
      this.logger.error(
        `Failed to send confirmation email to '${job.data.user.email}'`,
        err.stack,
      );
      throw err;
    }
  }
}
