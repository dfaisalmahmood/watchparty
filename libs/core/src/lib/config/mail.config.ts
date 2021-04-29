import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => ({
  host: process.env.MAIL_HOST || "localhost",
  port: parseInt(process.env.MAIL_PORT || "1025", 10),
  secure: process.env.MAIL_SECURE === "true" ? true : false,
  user: process.env.MAIL_USER || "root",
  pass: process.env.MAIL_PASS || "root",
  from: process.env.MAIL_FROM || "admin@watchparty.com",
  queueHost: process.env.MAIL_QUEUE_HOST || "127.0.0.1",
  queuePort: parseInt(process.env.MAIL_QUEUE_PORT || "6379", 10),
  live: process.env.MAIL_LIVE === "true" ? true : false,
}));
