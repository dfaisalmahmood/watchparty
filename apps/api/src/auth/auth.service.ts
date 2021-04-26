import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserInput } from "../users/dto/create-user.input";
import {
  EMAIL_CONSTRAINT,
  User,
  USERNAME_CONSTRAINT,
} from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthPayload } from "./dto/auth-payload.dto";
import { PassEncryptService } from "./pass-encrypt.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private encryption: PassEncryptService,
  ) {}

  async validateUser({ username, email, pass }: validateUserProps) {
    const user = await this.usersService.findByUsernameOrEmail(username, email);
    // if (user && user.password === pass) {
    if (user && this.encryption.verify(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>): Promise<AuthPayload> {
    const payload = { username: user.username, sub: user.id };
    return {
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(createUserData: CreateUserInput) {
    try {
      const hashedPass = await this.encryption.hash(createUserData.password);
      createUserData = { ...createUserData, password: hashedPass };
      const user = await this.usersService.create(createUserData);
      return await this.login(user);
    } catch (err) {
      if (err.code === "23505") {
        let errMsg: string;
        if (err.constraint === EMAIL_CONSTRAINT) {
          errMsg = "Email already exists.";
        } else if (err.constraint === USERNAME_CONSTRAINT) {
          errMsg = "Username already exists.";
        }
        if (errMsg) {
          throw new HttpException(
            {
              status: HttpStatus.CONFLICT,
              error: errMsg,
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async getProfile(userId: string) {
    return await this.usersService.findById(userId);
  }
}

// Types
type validateUserProps = {
  username?: string;
  email?: string;
  pass: string;
};
