import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class AuthUserPayload extends PickType(User, [
  "id",
  "username",
  "email",
  "accountStatus",
] as const) {}

@ObjectType()
export class AuthPayload {
  @Field(() => AuthUserPayload, { nullable: false })
  user: AuthUserPayload;

  @Field({ nullable: false })
  accessToken: string;

  @Field({ nullable: false })
  refreshToken: string;
}

@ObjectType()
export class RefreshPayload extends PickType(AuthPayload, [
  "user",
  "accessToken",
]) {}

// export type AuthUserPayload = Omit<User, "password">;
