import { doctorService } from "../services/doctorService"

const getTopDoctorHome = async (req, res) => {
    try {
        let limit = req.query.limit // Chuyển đổi limit về số nguyên
        if (isNaN(limit) || limit <= 0) limit = 10; // Đảm bảo giá trị mặc định

        console.log('🚀 ~ getTopDoctorHome ~ limit:', limit);

        const response = await doctorService.getTopDoctorHome(+limit); // Gọi đến service
        if (!response) {
            return res.status(404).json({ status: 'ERR', message: 'No data found' });
        }

        res.status(200).json(response); // Trả về phản hồi JSON
    } catch (error) {
        console.error('Error in getTopDoctorHome:', error); // Log lỗi
        return res.status(500).json({ status: 'ERR', message: error.message || 'Internal Server Error' });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const response = await doctorService.getAllDoctors()
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const saveInfoDoctor = async (req, res) => {
    try {
        const response = await doctorService.saveInfoDoctor(req.body)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getDetailDoctorById = async (req, res) => {
    try {
        const response = await doctorService.getDetailDoctorById(req.query.id)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const bulkCreateSchedule = async (req, res) => {
    try {
        const response = await doctorService.bulkCreateSchedule(req.body)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getScheduleByDate = async (req, res) => {
    try {
        const response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getExtraInforDoctorId = async (req, res) => {
    try {
        const response = await doctorService.getExtraInforDoctorById(req.query.doctorId)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getProfileDoctorById = async (req, res) => {
    try {
        const response = await doctorService.getProfileDoctorById(req.query.doctorId)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getListPatientForDoctor = async (req, res) => {
    try {
        const response = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const sendRemedy = async (req, res) => {
    try {
        console.log('🚀 ~ sendRemedy ~ req.body:', req.body)
        const response = await doctorService.sendRemedy(req.body)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
export const doctorController = {
    getTopDoctorHome,
    getAllDoctors,
    saveInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorId,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}