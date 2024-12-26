import { specialtyService } from "../services/specialtyService"

const createSpecialty = async (req, res) => {
    try {
        const infor = await specialtyService.createSpecialty(req.body)
        res.status(200).json(infor)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
const getAllSpecialty = async (req, res) => {
    try {
        const infor = await specialtyService.getAllSpecialty()
        res.status(200).json(infor)
    } catch (error) {
        return res.status(404).json({ status: 'ERR', message: new Error(error).message })
    }
}
export const specialtyController = {
    createSpecialty,
    getAllSpecialty
}