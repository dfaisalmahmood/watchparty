import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassEncryptService, PostgresErrorCodes } from "@watchparty/core";
import { CreateUserInput } from "../users/dto/create-user.input";
import {
  EMAIL_CONSTRAINT,
  User,
  USERNAME_CONSTRAINT,
} from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import {
  AuthPayload,
  AuthUserPayload,
  RefreshPayload,
} from "./dto/auth-payload.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryption: PassEncryptService,
    private readonly config: ConfigService,
  ) {}

  getCookieWithJwtAccessToken(user: AuthUserPayload) {
    const payload = this.getTokenPayload(user);
    const token = this.jwtService.sign(payload, {
      secret: this.config.get("jwt.accessTokenSecret"),
      expiresIn: `${this.config.get("jwt.accessTokenExpirationTime")}s`,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.config.get(
      "jwt.accessTokenExpirationTime",
    )}`;
    return {
      cookie,
      token,
    };
  }

  getCookieWithJwtRefreshToken(user: AuthUserPayload) {
    const payload = this.getTokenPayload(user);
    const token = this.jwtService.sign(payload, {
      secret: this.config.get("jwt.refreshTokenSecret"),
      expiresIn: `${this.config.get("jwt.refreshTokenExpirationTime")}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.config.get(
      "jwt.refreshTokenExpirationTime",
    )}`;
    return {
      cookie,
      token,
    };
  }

  getCookiesForLogout() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0`,
    ];
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

  private getTokenPayload(user: AuthUserPayload): TokenPayload {
    return { username: user.username, sub: user.id };
  }

  async login(user: AuthUserPayload): Promise<LoginReturn> {
    // const payload: TokenPayload = this.getTokenPayload(user);
    // const tokenString = this.jwtService.sign(payload);
    const {
      cookie: accessTokenCookie,
      token: accessToken,
    } = this.getCookieWithJwtAccessToken(user);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken,
    } = this.getCookieWithJwtRefreshToken(user);

    // Register refreshToken in DB
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      body: {
        user,
        accessToken,
        refreshToken,
      },
      accessTokenCookie,
      refreshTokenCookie,
    };
  }

  async logout(user: AuthUserPayload) {
    await this.usersService.removeRefreshToken(user.id);
    return true;
  }

  refresh(user: AuthUserPayload): RefreshReturn {
    const {
      cookie: accessTokenCookie,
      token: accessToken,
    } = this.getCookieWithJwtAccessToken(user);
    return {
      body: { user, accessToken },
      accessTokenCookie,
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

type LoginReturn = {
  body: AuthPayload;
  accessTokenCookie: string;
  refreshTokenCookie: string;
};

type RefreshReturn = {
  body: RefreshPayload;
  accessTokenCookie: string;
};
