import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserInReq } from "../token-payload.interface";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserInReq => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    return user;
  },
);
