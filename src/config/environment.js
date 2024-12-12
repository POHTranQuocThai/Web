
import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    URL_REACT: process.env.URL_REACT
}