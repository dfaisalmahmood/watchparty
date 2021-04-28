import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalEmailStrategy extends PassportStrategy(
  Strategy,
  "local-email",
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    return this.authService.validateUser({
      email,
      plainTextPassword: password,
    });

    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    // return user;
  }
}
