import { patientService } from "../services/patientService"

const postBookAppointment = async (req, res) => {
    try {
        const response = await patientService.postBookAppointment(req.body)
        res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}

export const patientController = {
    postBookAppointment
}