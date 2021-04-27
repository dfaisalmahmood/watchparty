import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import coreConfig from "./config/core.config";
import { CoreResovler } from "./config/core.resolver";
import { validationSchema } from "./config/validation";
import { TypeOrmModule } from "@nestjs/typeorm";
import databaseConfig from "./config/database.config";
import jwtConfig from "./config/jwt.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [coreConfig, databaseConfig, jwtConfig],
      validationSchema,
    }),
    GraphQLModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        cors: {
          origin: config.get("origin"),
          credentials: true,
        },
        autoSchemaFile: true,
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
  providers: [CoreResovler],
  exports: [],
})
export class CoreModule {}
