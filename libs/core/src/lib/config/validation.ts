import Joi = require("joi");

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  ORIGIN: Joi.string().default("http://locahost:3000"),
  PORT: Joi.number().default(3000),
  // Database
  DB_HOST: Joi.string().default("localhost"),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().default("postgres"),
  DB_USERNAME: Joi.string().default("postgres"),
  DB_PASSWORD: Joi.string().required(),

  // JWT
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

  // Cookies
  COOKIES_SECRET: Joi.string().required(),
});
