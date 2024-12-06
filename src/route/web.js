import express from 'express'
import { homeController } from '../controllers/homeController'
import { userController } from '../controllers/userController'

const router = express.Router()

export const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCrudPage)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-users', homeController.displayGetCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.post('/api/login', userController.login)
    return app.use('/', router)
}



