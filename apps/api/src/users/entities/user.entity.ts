import { ObjectType, Field, Int, InputType, HideField } from "@nestjs/graphql";
import { string } from "joi";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { AccountStatus } from "./account-status.enum";
import { AccountRole } from "./account-role.enum";
import { BaseModel } from "../../app/common/base.model";

export const EMAIL_CONSTRAINT = "UQ_user_email";
export const USERNAME_CONSTRAINT = "UQ_user_username";

@Entity()
// @ObjectType({
//   implements: () => [BaseModel],
// })
@ObjectType()
@InputType("UserInput")
export class User extends BaseModel {
  @Index(EMAIL_CONSTRAINT, { unique: true })
  @Column("text", { nullable: false })
  @Field({ nullable: false })
  email!: string;

  @Index(USERNAME_CONSTRAINT, { unique: true })
  @Column("text", { nullable: false })
  @Field({ nullable: false })
  username!: string;

  @Column("text", { nullable: false })
  @HideField()
  password!: string;

  @Column("text", { name: "current_hashed_refresh_token", nullable: true })
  @HideField()
  currentHashedRefreshToken?: string;

  @Index()
  @Column({
    type: "enum",
    enum: AccountStatus,
    default: AccountStatus.Unverified,
    nullable: false,
  })
  @Field((type) => AccountStatus)
  accountStatus!: AccountStatus;

  @Index()
  @Column({
    type: "enum",
    enum: AccountRole,
    default: AccountRole.User,
    nullable: false,
  })
  @Field((type) => AccountRole)
  accountRole!: AccountRole;
}
