require("dotenv").config();

// export default {
//   PORT: process.env.PORT,
//   USER: process.env.USER,
//   PASSWORD: process.env.PASSWORD,
//   DATABASE: process.env.DATABASE,
//   HOST: process.env.HOST,
//   DB_PORT: process.env.DB_PORT,

//   JWT_SECRET: process.env.JWT_SECRET,

//   DATABASE_URL: process.env.DATABASE_URL,

//   SENDER_EMAIL: process.env.SENDER_EMAIL,
//   SENDER_PASSWORD: process.env.SENDER_PASSWORD,
// };

module.exports = {
  PORT: process.env.PORT,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  HOST: process.env.HOST,
  DB_PORT: process.env.DB_PORT,

  JWT_SECRET: process.env.JWT_SECRET,

  DATABASE_URL: process.env.DATABASE_URL,

  SENDER_EMAIL: process.env.SENDER_EMAIL,
  SENDER_PASSWORD: process.env.SENDER_PASSWORD,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
