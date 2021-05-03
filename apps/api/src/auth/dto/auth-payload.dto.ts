import {
  createUnionType,
  Field,
  ObjectType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class AuthUserPayload extends PickType(User, [
  "id",
  "username",
  "accountStatus",
  "accountRole",
] as const) {}

@ObjectType()
export class VerifyUserPayload extends PickType(User, [
  "id",
  "username",
  "email",
  "accountStatus",
  "accountRole",
] as const) {}

export const UserPayload = createUnionType({
  name: "UserPayload",
  types: () => [AuthUserPayload, VerifyUserPayload],
  resolveType(value) {
    if (value.email) {
      return VerifyUserPayload;
    }

    return AuthUserPayload;
  },
});

@ObjectType()
export class AuthPayload {
  @Field(() => UserPayload, { nullable: false })
  user: typeof UserPayload;

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
