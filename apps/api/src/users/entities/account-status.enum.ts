import { registerEnumType } from "@nestjs/graphql";

export enum AccountStatus {
  Unverified = "unverified",
  Verified = "verified",
  Banned = "banned",
}

registerEnumType(AccountStatus, {
  name: "AccountStatus",
});
