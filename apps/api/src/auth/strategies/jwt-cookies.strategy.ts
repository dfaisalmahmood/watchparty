import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "rxjs";

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  "jwt_cookies",
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: config.get("jwt.accessTokenSecret"),
    });
  }

  async validate(payload: TokenPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
