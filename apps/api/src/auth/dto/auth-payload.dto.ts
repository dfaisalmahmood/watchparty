import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthPayload {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  accessToken: string;
}
