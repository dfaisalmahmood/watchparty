import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { JwtHeaderStrategy } from "./strategies/jwt-header.strategy";
import { JwtCookiesStrategy } from "./strategies/jwt-cookies.strategy";
import { LocalEmailStrategy } from "./strategies/local-email.strategy";
import { LocalUsernameStrategy } from "./strategies/local-username.strategy";
import { JwtRefreshTokenCookiesStrategy } from "./strategies/jwt-refresh-token-cookies.strategy";
import { JwtRefreshTokenBodyStrategy } from "./strategies/jwt-refresh-token-body.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get("jwt.accessTokenSecret"),
        signOptions: { expiresIn: config.get("jwt.accessTokenExpirationTime") },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalEmailStrategy,
    LocalUsernameStrategy,
    JwtHeaderStrategy,
    JwtCookiesStrategy,
    JwtRefreshTokenBodyStrategy,
    JwtRefreshTokenCookiesStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
