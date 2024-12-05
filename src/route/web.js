import express from 'express'
import { homeController } from '../controllers/homeController'

const router = express.Router()

export const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCrudPage)
    router.post('/post-crud', homeController.postCRUD)
    return app.use('/', router)
}



