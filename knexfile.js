require("dotenv").config();

module.exports = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/db/dmm_dev.db3",
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
    useNullAsDefault: true,
  },
};
