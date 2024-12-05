import express from 'express'
import { homeController } from '../controllers/homeController'

const router = express.Router()

export const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    return app.use('/', router)
}



