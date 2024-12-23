import express from 'express'
import { homeController } from '../controllers/homeController'
import { userController } from '../controllers/userController'
import { doctorController } from '../controllers/doctorController'
import { patientController } from '../controllers/patientController'

const router = express.Router()

export const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCrudPage)
    router.get('/api/get-all-users', userController.getAllUsers)
    router.post('/api/login', userController.login)
    router.post('/api/sign-up', userController.createNewUser)
    router.put('/api/edit-user', userController.editUser)
    router.delete('/api/delete-user', userController.deleteUser)
    router.get('/api/allcode', userController.getAllCode)
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctor', doctorController.getAllDoctors)
    router.post('/api/save-info-doctors', doctorController.saveInfoDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorId)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)

    return app.use('/', router)
}



