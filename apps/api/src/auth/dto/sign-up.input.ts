import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

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
