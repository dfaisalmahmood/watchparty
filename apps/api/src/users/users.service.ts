import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PassEncryptService } from "@watchparty/core";
import { Repository } from "typeorm";
import { BaseService } from "../app/common/base.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly encrypt: PassEncryptService,
  ) {
    super(userRepo);
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

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await this.encrypt.hash(refreshToken);
    await this.userRepo.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: string) {
    return this.userRepo.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findOne(userId);

    if (!user.currentHashedRefreshToken) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isRefreshTokenMatching = await this.encrypt.verify(
      user.currentHashedRefreshToken,
      refreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
