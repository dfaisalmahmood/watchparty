import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";

export const getWinstonTransports = () => {
  const transports: winston.transport[] = [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
    }),
    new winston.transports.File({
      filename: "combined.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ];
  if (process.env.NODE_ENV !== "production") {
    transports.push(
      new winston.transports.Console({
        level: "error",
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
    );
  }
  return transports;
};

export const csp = {
  directives: {
    defaultSrc: [`'self'`],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      "cdn.jsdelivr.net",
      "fonts.googleapis.com",
    ],
    fontSrc: [`'self'`, "fonts.gstatic.com"],
    imgSrc: [`'self'`, "data:", "cdn.jsdelivr.net"],
    scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
  },
};
