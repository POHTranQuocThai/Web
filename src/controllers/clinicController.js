import { clinicService } from "../services/clinicService"


const createClinic = async (req, res) => {
    try {
        const infor = await clinicService.createClinic(req.body)
        res.status(200).json(infor)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getAllClinic = async (req, res) => {
    try {
        const infor = await clinicService.getAllClinic()
        res.status(200).json(infor)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getDetailClinicById = async (req, res) => {
    try {
        const infor = await clinicService.getDetailClinicById(req.query.id)
        res.status(200).json(infor)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}

export const clinicController = {
    createClinic,
    getAllClinic,
    getDetailClinicById

}