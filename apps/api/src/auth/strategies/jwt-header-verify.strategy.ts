import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccountStatus } from "../../users/entities/account-status.enum";
import {
  TokenPayload,
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

  validate(payload: VerifyAccountTokenPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      accountStatus: payload.accountStatus,
    };
  }
}
