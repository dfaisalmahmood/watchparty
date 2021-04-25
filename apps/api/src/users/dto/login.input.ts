import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  username?: string;
  @Field({ nullable: false })
  password: string;
}
