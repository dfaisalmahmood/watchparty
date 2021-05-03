import { CreateUserInput } from "./create-user.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { Type } from "@nestjs/common";
import { BaseModel } from "../../app/common/base.model";
import { DeepPartial } from "typeorm";
import { AccountRole } from "../entities/account-role.enum";
import { AccountStatus } from "../entities/account-status.enum";

@InputType()
export class UpdateUserInput implements DeepPartial<User> {
  @Field({ nullable: false })
  id?: string;
  @Field({ nullable: false })
  email?: string;
  @Field({ nullable: false })
  username?: string;
  @Field((type) => AccountRole, { nullable: false })
  accountRole?: AccountRole;
  @Field((type) => AccountStatus, { nullable: false })
  accountStatus?: AccountStatus;
}

// export class UpdateUserInput extends BaseModel {}

// let x = new UpdateUserInput();
type x = typeof UpdateUserInput;
type y = InstanceType<x>;
// type m = typeof y;
type m = Type<y>;
let z: y = new UpdateUserInput();
