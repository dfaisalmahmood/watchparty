import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { request } from "node:http";
import { userInfo } from "node:os";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import {
  AuthPayload,
  AuthUserPayload,
  RefreshPayload,
} from "./dto/auth-payload.dto";
import { LoginInput } from "./dto/login.input";
import { SignUpInput } from "./dto/sign-up.input";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { JwtVerifyAccountGuard } from "./guards/jwt-verify.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtHeaderVerifyStrategy } from "./strategies/jwt-header-verify.strategy";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthUserPayload, {
    name: "signup",
    description: "Creates new user. Email and Username have to be unique.",
  })
  @Public()
  async signup(
    @Args("signupData") signupData: SignUpInput,
    @Context() context,
  ) {
    // const {
    //   body,
    //   accessTokenCookie,
    //   refreshTokenCookie,
    // } = await this.authService.signup(signupData);
    // context.reply.header("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    // return body;
    return await this.authService.signup(signupData);
  }

  @Mutation(() => AuthPayload, {
    name: "login",
    description:
      "Logs user in, attaches cookie to client as HttpOnly, returns user info and JWT access_token.",
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(
    @Args("username", { nullable: true }) username: string,
    @Args("email", { nullable: true }) email: string,
    @Args("password") password: string,
    // @Context() context: GraphQLExecutionContext,
    @Context() context,
    @CurrentUser() user: User,
  ) {
    const {
      body,
      accessTokenCookie,
      refreshTokenCookie,
    } = await this.authService.login(user as AuthUserPayload);
    context.reply.header("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    return body;
  }

  @Mutation(() => Boolean, {
    name: "logout",
    description: "Removes cookie from client to prevent further access.",
  })
  async logout(@Context() context, @CurrentUser() user) {
    this.authService.logout(user as AuthUserPayload);
    context.reply.header("Set-Cookie", this.authService.getCookiesForLogout());
    context.reply.code(200);
    return true;
  }

  @Mutation(() => RefreshPayload, {
    name: "refresh",
    description: "Refreshes access token using refreshToken",
  })
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: User,
    @Context() context,
    @Args("refreshToken", { nullable: true }) refreshToken?: string,
  ) {
    const { body, accessTokenCookie } = this.authService.refresh(user);
    // const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
    // user as AuthUserPayload,
    // );
    context.reply.header("Set-Cookie", accessTokenCookie);
    return body;
  }

  @Query(() => User, {
    name: "profile",
    description: "Returns full user info (without password).",
  })
  async profile(@CurrentUser() user: User) {
    return await this.authService.getProfile(user.id);
  }

  @Mutation(() => AuthPayload, {
    name: "verify",
    description:
      "Verification post-signup. Link sent to email contains JWT token containing user info.",
  })
  @Public()
  @UseGuards(JwtVerifyAccountGuard)
  async verifyAccount(@CurrentUser() user: User, @Context() context) {
    const {
      body,
      accessTokenCookie,
      refreshTokenCookie,
    } = await this.authService.verifyAccount(user);
    context.reply.header("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    return body;
  }
}
