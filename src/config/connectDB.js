import Sequelize from 'sequelize'
import { env } from './environment';

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(env.DB_DATABASE_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions:
        env.DB_SSL === 'true' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        } : {},
    query: { "raw": true },
    timezone: "+07:00"
})

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}