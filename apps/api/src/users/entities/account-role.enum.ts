import { registerEnumType } from "@nestjs/graphql";

export enum AccountRole {
  User = "user",
  Admin = "admin",
  SuperAdmin = "super-admin",
}

registerEnumType(AccountRole, {
  name: "AccountRole",
});
