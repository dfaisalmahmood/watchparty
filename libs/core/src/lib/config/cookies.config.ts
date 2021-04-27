import { registerAs } from "@nestjs/config";

export default registerAs("cookies", () => ({
  secret: process.env.COOKIES_SECRET,
}));
