import { ObjectType, Field, Int } from "@nestjs/graphql";
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
import { AccountRole } from "./accountRole.enum";

export const EMAIL_CONSTRAINT = "UQ_user_email";
export const USERNAME_CONSTRAINT = "UQ_user_username";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field({ nullable: false })
  id: string;

  @Index(EMAIL_CONSTRAINT, { unique: true })
  @Column("text", { nullable: false })
  @Field({ nullable: false })
  email: string;

  @Index(USERNAME_CONSTRAINT, { unique: true })
  @Column("text", { nullable: false })
  @Field({ nullable: false })
  username: string;

  @Column("text", { nullable: false })
  password: string;

  @Column("text", { nullable: true })
  currentHashedRefreshToken: string;

  @Column({
    type: "enum",
    enum: AccountStatus,
    default: AccountStatus.Unverified,
    nullable: false,
  })
  @Field((type) => AccountStatus, { nullable: true })
  accountStatus: AccountStatus;

  @Column({
    type: "enum",
    enum: AccountRole,
    default: AccountRole.User,
    nullable: false,
  })
  @Field((type) => AccountRole, { nullable: true })
  accountRole: AccountRole;
}
