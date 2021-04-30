import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { CreateUserInput } from "../../users/dto/create-user.input";

@InputType()
export class SignUpInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  username: string;

  @Field({ nullable: false })
  @IsEmail()
  email: string;

  @Field({ nullable: false })
  @MinLength(8)
  password: string;
}
