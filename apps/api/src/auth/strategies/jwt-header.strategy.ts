import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccountStatus } from "../../users/entities/account-status.enum";
import { TokenPayload, UserInReq } from "../token-payload.interface";

@Injectable()
export class JwtHeaderStrategy extends PassportStrategy(
  Strategy,
  "jwt-header",
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("jwt.accessTokenSecret"),
    });
  }

  validate(payload: TokenPayload): UserInReq {
    if (payload.accountStatus === AccountStatus.Verified) {
      return {
        id: payload.sub,
        username: payload.username,
        accountStatus: payload.accountStatus,
        accountRole: payload.accountRole,
      };
    }
  }
}
