import { Type } from "@nestjs/common";
import { InputType, Int, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { DeepPartial } from "typeorm";
import { User } from "../entities/user.entity";

// TODO: Needs to be fixed
@InputType()
export class CreateUserInput implements DeepPartial<User> {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  password: string;
}
