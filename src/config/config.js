const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    query: { raw: true },
    define: { freezeTableName: true },
    dialectOptions:
      process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        }
      } : {},
    timezone: '+07:00',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
