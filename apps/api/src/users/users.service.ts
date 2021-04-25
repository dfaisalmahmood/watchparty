import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(createUserInput: CreateUserInput) {
    return this.userRepo.create(createUserInput).save();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // async login(loginInput: LoginInput) {
  //   return await this.userRepo.findOne(loginInput);
  // }

  // async signUp(signUpInput: SignUpInput) {
  //   return await this.userRepo.create(signUpInput).save();
  // }

  async findByUsername(username: string) {
    return await this.userRepo.findOne({ username });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ email });
  }

  async findByUsernameOrEmail(username?: string, email?: string) {
    if (username) {
      return await this.findByUsername(username);
    } else if (email) {
      return await this.findByUsername(email);
    }
    return null;
  }

  async findById(id: string) {
    return await this.userRepo.findOne({ id });
  }
}
