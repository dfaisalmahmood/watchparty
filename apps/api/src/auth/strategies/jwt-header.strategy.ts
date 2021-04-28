import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

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

  async validate(payload: TokenPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
