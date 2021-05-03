import {
  Field,
  GraphQLISODateTime,
  InterfaceType,
  ObjectType,
} from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

// @InterfaceType()
@ObjectType({ isAbstract: true })
export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Index()
  @CreateDateColumn({ name: "created_at" })
  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deletedAt?: Date;
}
