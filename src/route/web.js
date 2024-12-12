import express from 'express'
import { homeController } from '../controllers/homeController'
import { userController } from '../controllers/userController'

const router = express.Router()

export const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCrudPage)
    router.get('/api/get-all-users', userController.getAllUser)
    router.post('/api/login', userController.login)
    router.post('/api/sign-up', userController.createNewUser)
    router.put('/api/edit-user', userController.editUser)
    router.delete('/api/delete-user', userController.deleteUser)
    router.get('/allcode', userController.getAllCode)
    return app.use('/', router)
}



