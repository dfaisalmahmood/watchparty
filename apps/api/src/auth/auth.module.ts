import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import jwtConfig from "./config/jwt.config";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalEmailStrategy } from "./strategies/local-email.strategy";
import { LocalUsernameStrategy } from "./strategies/local-username.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get("jwt.secret"),
        signOptions: { expiresIn: config.get("jwt.expiresIn") },
      }),
      inject: [ConfigService],
    }),
    // JwtModule.register({
    //   secret: "dfasdfsadf34",
    //   signOptions: { expiresIn: "600s" },
    // }),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalEmailStrategy,
    LocalUsernameStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
