import { AccountStatus } from "../users/entities/account-status.enum";
import { AccountRole } from "../users/entities/accountRole.enum";

export interface TokenPayload {
  sub: string; // UserID
  username: string;
  accountStatus: AccountStatus;
  accountRole: AccountRole;
}

export interface VerifyAccountTokenPayload extends TokenPayload {
  email: string;
  accountStatus: AccountStatus;
}

export class UserInReq implements Omit<TokenPayload, "sub"> {
  id: string;
  email?: string;
  username: string;
  accountStatus: AccountStatus;
  accountRole: AccountRole;
}
