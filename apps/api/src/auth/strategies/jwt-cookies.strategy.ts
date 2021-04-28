import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

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

  async validate(payload: TokenPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
