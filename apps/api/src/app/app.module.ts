import { CaslModule } from "./../casl/casl.module";
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoreModule } from "@watchparty/core";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [CaslModule, CoreModule, UsersModule, AuthModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
