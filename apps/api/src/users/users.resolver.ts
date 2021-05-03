import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { Public } from "../auth/decorators/public.decorator";
import { BaseResolver } from "../app/common/base.resolver";

@Resolver(() => User)
export class UsersResolver extends BaseResolver(
  User,
  CreateUserInput,
  UpdateUserInput,
) {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  // @Mutation(() => User)
  // @Public()
  // createUser(@Args("createUserInput") createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  // @Query(() => [User], { name: "users" })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Query(() => User, { name: "user" })
  // findOne(@Args("id", { type: () => Int }) id: number) {
  //   return this.usersService.findOne(id);
  // }

  // @Mutation(() => User)
  // updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => User)
  // removeUser(@Args("id", { type: () => Int }) id: number) {
  //   return this.usersService.remove(id);
  // }

  // @Mutation(() => User)
  // async login(@Args("loginData") loginData: LoginInput) {
  //   return await this.usersService.login(loginData);
  // }

  // @Mutation(() => User)
  // async signUp(@Args("signUpData") signUpData: SignUpInput) {
  //   return this.usersService.signUp(signUpData);
  // }
}
