export default () => ({
  appName: process.env.APP_NAME || "WatchParty",
  origin: process.env.ORIGIN,
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || "3000", 10),
});
