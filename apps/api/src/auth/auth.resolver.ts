import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { userInfo } from "node:os";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { AuthPayload } from "./dto/auth-payload.dto";
import { LoginInput } from "./dto/login.input";
import { SignUpInput } from "./dto/sign-up.input";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload, { name: "login" })
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(
    @Args("username", { nullable: true }) username: string,
    @Args("email", { nullable: true }) email: string,
    @Args("password") password: string,
    @CurrentUser() user: User,
  ) {
    return await this.authService.login(user);
  }

  @Mutation(() => AuthPayload, { name: "signup" })
  @Public()
  async signup(@Args("signupData") signupData: SignUpInput) {
    return await this.authService.signup(signupData);
  }

  @Query(() => User)
  async profile(@CurrentUser() user: User) {
    return await this.authService.getProfile(user.id);
  }
}
