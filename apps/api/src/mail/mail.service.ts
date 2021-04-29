import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { queueNames } from "@watchparty/core";
import { Queue } from "bull";
import { User } from "../users/entities/user.entity";
import { MailTypes } from "./mail-types.enum";

@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue(queueNames.MAIL_QUEUE)
    private readonly mailQueue: Queue,
  ) {}

  /** Send email confirmation link to new user account. */
  async sendConfirmationEmail(user: User, code: string): Promise<boolean> {
    try {
      await this.mailQueue.add(MailTypes.Verification, {
        user,
        code,
      });
      return true;
    } catch (err) {
      this.logger.error(
        `Error queueing confirmation email to user ${user.email}`,
      );
      return false;
    }
  }
}
