import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import { AuthService } from "../auth/auth.service";
import { Public } from "../auth/decorators/public.decorator";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";
import { User } from "../users/entities/user.entity";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  @Public()
  getData() {
    return this.appService.getData();
  }

  // @Post("login")
  // @UseGuards(LocalAuthGuard)
  // async login(@Req() req) {
  //   // return this.authService.login(req.user);
  //   return this.authService.login(req.user as Pick<User, "username" | "id">);
  // }
}
