import { InputType, Int, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  password: string;
}
