import { Field, InputType } from "@nestjs/graphql";
import { CreateUserInput } from "../../users/dto/create-user.input";

@InputType()
export class SignUpInput {
  @Field({ nullable: false })
  username: string;
  @Field({ nullable: false })
  email: string;
  @Field({ nullable: false })
  password: string;
}
