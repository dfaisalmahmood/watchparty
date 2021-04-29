import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
@Public()
export class AuthController {
  @Get("/verify")
  confirm(@Query("token") token: string) {
    return token;
  }
}
