import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccountStatus } from "../../users/entities/account-status.enum";
import {
  TokenPayload,
  UserInReq,
  VerifyAccountTokenPayload,
} from "../token-payload.interface";

@Injectable()
export class JwtHeaderVerifyStrategy extends PassportStrategy(
  Strategy,
  "jwt-header-verify",
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("jwt.confirmTokenSecret"),
    });
  }

  validate(payload: VerifyAccountTokenPayload): UserInReq {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      accountStatus: payload.accountStatus,
      accountRole: payload.accountRole,
    };
  }
}
