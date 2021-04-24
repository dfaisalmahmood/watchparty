import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { configuration } from "./config/configuration";
import { CoreResovler } from "./config/core.resolver";
import { validationSchema } from "./config/validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true, // TODO: Change to "false" during actual production
    }),
  ],
  controllers: [],
  providers: [CoreResovler],
  exports: [],
})
export class CoreModule {}
