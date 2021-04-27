import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PostgresErrorCodes } from "@watchparty/core";
import { CreateUserInput } from "../users/dto/create-user.input";
import {
  EMAIL_CONSTRAINT,
  User,
  USERNAME_CONSTRAINT,
} from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthPayload, AuthUserPayload } from "./dto/auth-payload.dto";
import { PassEncryptService } from "./pass-encrypt.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryption: PassEncryptService,
    private readonly config: ConfigService,
  ) {}

  getCookieWithJwtToken(tokenString: string) {
    return `Authentication=${tokenString}; HttpOnly; Path=/; Max-Age=${this.config.get(
      "jwt.accessTokenExpirationTime",
    )}`;
  }

  getCookieForLogout() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async validateUser({
    username,
    email,
    plainTextPassword,
  }: validateUserProps): Promise<Partial<User>> {
    try {
      const user = await this.usersService.findByUsernameOrEmail(
        username,
        email,
      );
      await this.verifyPassword(user.password, plainTextPassword);
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    } catch (error) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async verifyPassword(
    hashedPassword: string,
    plainTextPassword: string,
  ) {
    const isPasswordMatching = await this.encryption.verify(
      hashedPassword,
      plainTextPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(user: AuthUserPayload): Promise<AuthPayload> {
    const payload: TokenPayload = { username: user.username, sub: user.id };
    const tokenString = this.jwtService.sign(payload);
    return {
      user,
      accessToken: tokenString,
    };
  }

  async signup(createUserData: CreateUserInput) {
    try {
      const hashedPass = await this.encryption.hash(createUserData.password);
      createUserData = { ...createUserData, password: hashedPass };
      const user = await this.usersService.create(createUserData);
      return await this.login(user);
    } catch (err) {
      if (err.code === PostgresErrorCodes.UniqueViolation) {
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
  plainTextPassword: string;
};
