import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

// @ObjectType()
// export class AuthUserPayload {
//   @Field({ nullable: false })
//   id: string;
//   @Field({ nullable: false })
//   username: string;
//   @Field({ nullable: false })
//   email: string;
// }

@ObjectType()
export class AuthUserPayload extends PickType(User, [
  "id",
  "username",
  "email",
] as const) {}

@ObjectType()
export class AuthPayload {
  @Field(() => AuthUserPayload, { nullable: false })
  user: AuthUserPayload;

  @Field({ nullable: false })
  accessToken: string;
}

// export type AuthUserPayload = Omit<User, "password">;
