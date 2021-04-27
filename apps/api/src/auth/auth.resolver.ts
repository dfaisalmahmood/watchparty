import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { userInfo } from "node:os";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { AuthPayload, AuthUserPayload } from "./dto/auth-payload.dto";
import { LoginInput } from "./dto/login.input";
import { SignUpInput } from "./dto/sign-up.input";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
    const body = await this.authService.login(user as AuthUserPayload);
    const cookie = this.authService.getCookieWithJwtToken(body.accessToken);
    context.reply.header("Set-Cookie", cookie);
    return body;
  }

  @Mutation(() => Boolean, {
    name: "logout",
    description: "Removes cookie from client to prevent further access.",
  })
  async logout(@Context() context) {
    context.reply.header("Set-Cookie", this.authService.getCookieForLogout());
    context.reply.code(200);
    return true;
  }

  @Mutation(() => AuthPayload, {
    name: "signup",
    description: "Creates new user. Email and Username have to be unique.",
  })
  @Public()
  async signup(@Args("signupData") signupData: SignUpInput) {
    return await this.authService.signup(signupData);
  }

  @Query(() => User, {
    name: "profile",
    description: "Returns full user info (without password).",
  })
  async profile(@CurrentUser() user: User) {
    return await this.authService.getProfile(user.id);
  }
}
