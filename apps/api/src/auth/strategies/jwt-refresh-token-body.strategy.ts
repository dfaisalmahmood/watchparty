import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AccountStatus } from "../../users/entities/account-status.enum";
import { UsersService } from "../../users/users.service";
import { TokenPayload } from "../token-payload.interface";

@Injectable()
export class JwtRefreshTokenBodyStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token-body",
) {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request.body.refreshToken;
        },
      ]),
      secretOrKey: config.get("jwt.refreshTokenSecret"),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: TokenPayload) {
    if (payload.accountStatus === AccountStatus.Verified) {
      const refreshToken = request.body.refreshToken;
      // Here, payload.sub is userId
      return this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload.sub,
      );
    }
  }
}
