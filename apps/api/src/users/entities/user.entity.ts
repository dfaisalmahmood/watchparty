import { ObjectType, Field, Int } from "@nestjs/graphql";
import { string } from "joi";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field({ nullable: false })
  id: string;

  @Column("text", { nullable: false, unique: true })
  @Field({ nullable: false })
  email: string;

  @Column("text", { nullable: false, unique: true })
  @Field({ nullable: false })
  username: string;

  @Column("text", { nullable: false })
  @Field({ nullable: false })
  password: string;
}
