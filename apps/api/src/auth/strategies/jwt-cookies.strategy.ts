import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccountStatus } from "../../users/entities/account-status.enum";
import { TokenPayload } from "../token-payload.interface";

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  "jwt-cookies",
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get("jwt.accessTokenSecret"),
    });
  }

  validate(payload: TokenPayload) {
    if (payload.accountStatus === AccountStatus.Verified) {
      return {
        id: payload.sub,
        username: payload.username,
        accountStatus: payload.accountStatus,
      };
    }
  }
}
