export default () => ({
  appName: process.env.APP_NAME || "WatchParty",
  origin: process.env.ORIGIN,
  clientOrigin: process.env.CLIENT_ORIGIN,
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || "3000", 10),
  superAdmin: process.env.SUPER_ADMIN,
});
