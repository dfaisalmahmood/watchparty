import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import coreConfig from "./config/core.config";
import { CoreResovler } from "./config/core.resolver";
import { validationSchema } from "./config/validation";
import { TypeOrmModule } from "@nestjs/typeorm";
import databaseConfig from "./config/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [coreConfig, databaseConfig],
      validationSchema,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true, // TODO: Change to "false" during actual production
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
