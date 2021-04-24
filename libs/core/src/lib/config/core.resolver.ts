import { Float, Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class CoreResovler {
  @Query(() => Float)
  uptime() {
    return process.uptime();
  }
}
