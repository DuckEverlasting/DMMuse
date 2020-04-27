require("dotenv").config()

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'postgrespass',
      database : 'DMMuseDevelopment'
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  }

};
