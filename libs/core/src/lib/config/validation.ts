import Joi = require("joi");

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT: Joi.number().default(3000),
  // Database
  DB_HOST: Joi.string().default("localhost"),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().default("postgres"),
  DB_USERNAME: Joi.string().default("postgres"),
  DB_PASSWORD: Joi.string().required(),
});
