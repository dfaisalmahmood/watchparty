import { User } from "../users/entities/user.entity";
import {
  AbilityBuilder,
  InferSubjects,
  Ability,
  AbilityClass,
  ExtractSubjectType,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "./action.enum";
import { AccountRole } from "../users/entities/account-role.enum";

export type Subjects = InferSubjects<typeof User> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    // --- SuperAdmin ---
    if (user.accountRole === AccountRole.SuperAdmin) {
      can(Action.Manage, "all"); // read-write access to everything
      cannot(Action.Create, User);
    }

    // --- Admin ---
    if (user.accountRole === AccountRole.Admin) {
      can(Action.Manage, "all");
      cannot(Action.Create, User);
      cannot(Action.Manage, User, {
        accountRole: AccountRole.SuperAdmin,
      });
      cannot(Action.Update, User, ["accountRole"]);
    }

    // --- User ---
    if (user.accountRole === AccountRole.User) {
      // User
      can([Action.Read, Action.Update], User, { id: user.id });
      cannot(Action.Update, User, ["accountStatus"]);
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
