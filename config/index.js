//db.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DOMAIN: process.env.DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH: process.env.JWT_REFRESH,
  JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
