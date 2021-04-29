import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
// @ts-ignore
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { config } from "rxjs";
import { queueNames } from "@watchparty/core";
import { MailService } from "./mail.service";
import { MailProcessor } from "./mail.processor";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get("mail.host"),
          port: config.get("mail.port"),
          secure: config.get("mail.secure"),
          // tls: { ciphers: "SSLv3", },  // gmail
          auth: {
            user: config.get("mail.user"),
            pass: config.get("mail.pass"),
          },
        },
        defaults: {
          from: config.get("mail.from"),
        },
        template: {
          // dir: __dirname + "./assets/mail-templates/",
          dir:
            "D:\\Projects\\watchparty\\dist\\apps\\api\\assets\\mail-templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: queueNames.MAIL_QUEUE,
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get("mail.queueHost"),
          port: config.get("mail.queuePort"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
