import { Type } from "@nestjs/common";
import { DeepPartial, Repository, UpdateResult } from "typeorm";
import { BaseModel } from "./base.model";

// export function BaseService<T extends Type<unknown>>(
//   classRef: T,
//   repo: Repository<T>,
// ) {
//   abstract class BaseServiceHost {
//     async findAll(): Promise<T[]> {
//       return await repo.find();
//     }

//     async findById(_id: string): Promise<T> {
//       return await repo.findOne(_id);
//     }

//     async create(item: DeepPartial<T>): Promise<T> {
//       return await repo.create(item);
//     }

//     async update(id: string, item: DeepPartial<T>) {
//       return await repo.update(id, item);
//     }

//     async delete(ids: string[]) {
//       return await repo.softDelete(ids);
//     }

//     async deletePermanent(ids: string[]) {
//       return await repo.delete(ids);
//     }
//   }

//   return BaseServiceHost;
// }

export abstract class BaseService<T extends BaseModel> {
  constructor(private repo: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repo.find();
  }

  async findOne(_id: string): Promise<T> {
    return await this.repo.findOne(_id);
  }

  async find(partial: DeepPartial<T>): Promise<T[]> {
    return await this.repo.find({ where: partial });
  }

  async create(item: DeepPartial<T>): Promise<T> {
    return await this.repo.create(item).save();
  }

  async update(id: string, partial: DeepPartial<T>): Promise<boolean> {
    if (await this.repo.update(id, partial)) {
      return true;
    }
    return false;
  }

  async delete(ids: string[]): Promise<boolean> {
    if (await this.repo.softDelete(ids)) {
      return true;
    }
    return false;
  }

  async restore(ids: string[]): Promise<boolean> {
    if (await this.repo.restore(ids)) {
      return true;
    }
    return false;
  }

  async deletePermanent(ids: string[]): Promise<boolean> {
    if (await this.repo.delete(ids)) {
      return true;
    }
    return false;
  }
}
