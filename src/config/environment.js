
import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    URL_REACT: process.env.URL_REACT,
    MAX_NUMBER_SCHEDULE: process.env.MAX_NUMBER_SCHEDULE,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    EMAIL_APP: process.env.EMAIL_APP,
    DB_SSL: process.env.DB_SSL,
    DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT
}