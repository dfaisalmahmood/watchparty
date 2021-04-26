import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { WinstonModule } from "nest-winston";
import { AppModule } from "./app/app.module";
import { getWinstonTransports, csp } from "./config";
import * as helmet from "fastify-helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      logger: WinstonModule.createLogger({
        transports: getWinstonTransports(),
      }),
    },
  );

  // Helmet
  // @ts-ignore
  app.register(helmet, {
    contentSecurityPolicy: csp,
  });

  // Config
  const config = app.get(ConfigService);
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = config.get("port");
  await app.listen(port, () => {
    Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix);
    Logger.log(`Running in ${config.get("environment")} mode`);
  });
}

bootstrap();
