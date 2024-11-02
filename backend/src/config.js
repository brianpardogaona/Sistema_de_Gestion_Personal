require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT,
  },
  postgres: {
    options: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      dialect: process.env.PG_DIALECT,
    },
  },
  // client: null
};
