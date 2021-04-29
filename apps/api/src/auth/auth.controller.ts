import { Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
@Public()
export class AuthController {
  @Get(":token/confirm")
  confirm(@Param("token") encodedToken: string) {
    return encodedToken;
  }
}
