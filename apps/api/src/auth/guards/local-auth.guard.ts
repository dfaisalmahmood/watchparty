import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard([
  "local_username",
  "local_email",
]) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    request.body = ctx.getArgs();
    return request;
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    return true;
  }
}
