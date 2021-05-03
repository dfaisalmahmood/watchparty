import { Type } from "@nestjs/common";
import {
  Args,
  InputType,
  Int,
  Mutation,
  PartialType,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { DeepPartial } from "typeorm";
import { BaseModel } from "./base.model";
import { BaseService } from "./base.service";

export function BaseResolver<
  T extends Type<BaseModel>,
  // TODO: Type U needs to be fixed
  U extends Type<DeepPartial<InstanceType<T>>>,
  V extends Type<DeepPartial<InstanceType<T>>>
  // >(classRef: T, service: ReturnType<typeof BaseService>): any {
>(classRef: T, createdInput: U, updateInput: V) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost implements IBaseResolver<InstanceType<T>> {
    constructor(private service: BaseService<InstanceType<T>>) {}

    @Query((type) => [classRef], { name: `findAll${classRef.name}` })
    async findAll() {
      return this.service.findAll();
    }

    @Query((type) => classRef, { name: `findOne${classRef.name}` })
    async findOne(@Args("id") id: string) {
      return this.service.findOne(id);
    }

    @Query((type) => [classRef], { name: `find${classRef.name}` })
    async find(
      @Args("partialItem", { type: () => updateInput })
      partial: InstanceType<V>,
    ) {
      return this.service.find(partial);
    }

    @Mutation((type) => classRef, { name: `create${classRef.name}` })
    async create(
      @Args("item", { type: () => createdInput }) item: InstanceType<U>,
    ) {
      return this.service.create(item);
    }

    @Mutation((type) => Boolean, { name: `update${classRef.name}` })
    async update(
      @Args("id") id: string,
      @Args("partialItem", {
        type: () => updateInput,
      })
      partial: InstanceType<V>,
    ): Promise<boolean> {
      return this.service.update(id, partial);
    }

    @Mutation((type) => Boolean, { name: `delete${classRef.name}` })
    async delete(
      @Args("ids", { type: () => [String] }) ids: string[],
    ): Promise<boolean> {
      return this.service.delete(ids);
    }

    @Mutation((type) => Boolean, { name: `restore${classRef.name}` })
    async restore(
      @Args("ids", { type: () => [String] }) ids: string[],
    ): Promise<boolean> {
      return this.service.restore(ids);
    }

    @Mutation((type) => Boolean, { name: `deletePermanent${classRef.name}` })
    async deletePermanent(
      @Args("ids", { type: () => [String] }) ids: string[],
    ): Promise<boolean> {
      return this.service.deletePermanent(ids);
    }
  }

  return BaseResolverHost;
}

interface IBaseResolver<T> {
  findAll: () => Promise<T[]>;
  findOne: (id: string) => Promise<T>;
  find: (partial: DeepPartial<T>) => Promise<T[]>;
  create: (item: DeepPartial<T>) => Promise<T>;
  update: (id: string, partial: DeepPartial<T>) => Promise<boolean>;
  delete: (ids: string[]) => Promise<boolean>;
  restore: (ids: string[]) => Promise<boolean>;
  deletePermanent: (ids: string[]) => Promise<boolean>;
}
