import { AccountStatus } from "../users/entities/account-status.enum";

export interface TokenPayload {
  sub: string; // UserID
  username: string;
  accountStatus: AccountStatus;
}

export interface VerifyAccountTokenPayload extends TokenPayload {
  email: string;
  accountStatus: AccountStatus;
}
