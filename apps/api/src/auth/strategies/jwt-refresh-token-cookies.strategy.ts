import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AccountStatus } from "../../users/entities/account-status.enum";
import { UsersService } from "../../users/users.service";
import { TokenPayload } from "../token-payload.interface";

@Injectable()
export class JwtRefreshTokenCookiesStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token-cookies",
) {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get("jwt.refreshTokenSecret"),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: TokenPayload) {
    if (payload.accountStatus === AccountStatus.Verified) {
      const refreshToken = request.cookies?.Refresh;
      // Here, payload.sub is userId
      return this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload.sub,
      );
    }
  }
}
