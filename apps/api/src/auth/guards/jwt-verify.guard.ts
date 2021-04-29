import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtVerifyAccountGuard extends AuthGuard("jwt-header-verify") {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // request.body = ctx.getArgs();
    return request;
  }

  // async canActivate(context: ExecutionContext) {
  //   // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //   //   context.getHandler(),
  //   //   context.getClass(),
  //   // ]);
  //   // if (isPublic) {
  //   //   return true;
  //   // }

  //   return await super.canActivate(context);
  //   // return true;
  // }
}
