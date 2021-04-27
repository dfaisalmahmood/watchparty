import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalUsernameStrategy extends PassportStrategy(
  Strategy,
  "local_username",
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "username",
    });
  }

  async validate(username: string, password: string) {
    return this.authService.validateUser({
      username,
      plainTextPassword: password,
    });

    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    // return user;
  }
}
