import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import coreConfig from "./config/core.config";
import { CoreResovler } from "./config/core.resolver";
import { validationSchema } from "./config/validation";
import { TypeOrmModule } from "@nestjs/typeorm";
import databaseConfig from "./config/database.config";
import jwtConfig from "./config/jwt.config";
import cookiesConfig from "./config/cookies.config";
import { PassEncryptService } from "./pass-encrypt.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [coreConfig, databaseConfig, jwtConfig, cookiesConfig],
      validationSchema,
    }),
    GraphQLModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        // Accessing req, res passed to context in resolvers
        context: ({ req, reply }) => ({ req, reply }),
        cors: {
          origin: config.get("origin"),
          credentials: true,
        },
        // autoSchemaFile: true,
        autoSchemaFile: "schema.gql",
        playground: true, // TODO: Change to "false" during actual production
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("database.host"),
        port: config.get("database.port"),
        database: config.get("database.name"),
        username: config.get("database.username"),
        password: config.get("database.password"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: config.get("environment") === "production" ? false : true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [CoreResovler, PassEncryptService],
  exports: [PassEncryptService],
})
export class CoreModule {}
