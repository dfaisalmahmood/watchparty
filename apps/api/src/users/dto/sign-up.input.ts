import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SignUpInput {
  @Field({ nullable: false })
  username: string;
  @Field({ nullable: false })
  email: string;
  @Field({ nullable: false })
  password: string;
}
