import db from "../models"

const createClinic = async (reqBody) => {
    try {
        if (!reqBody.name || !reqBody.imageBase64 || !reqBody.descriptionHTML || !reqBody.descriptionMarkdown || !reqBody.address) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }
        await db.Clinic.create({
            name: reqBody.name,
            address: reqBody.address,
            image: reqBody.imageBase64,
            descriptionHTML: reqBody.descriptionHTML,
            descriptionMarkdown: reqBody.descriptionMarkdown
        })
        return { status: 'OK', message: 'OK!' }

    } catch (error) {
        throw error
    }
}
const getAllClinic = async () => {
    try {
        const data = await db.Clinic.findAll()
        if (data) {
            data.map(item => {
                item.image = new Buffer(item.image, 'base64').toString('binary')
                return item
            })
        }
        return { status: 'OK', message: 'OK!', data: data }
    } catch (error) {
        throw error
    }
}
const getDetailClinicById = async (id) => {
    try {
        if (!id) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }

        const data = await db.Clinic.findOne({
            where: { id: id },
            attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
        })
        if (data) {
            let doctorClinic = []
            doctorClinic = await db.Doctor_Infor.findAll({
                where: {
                    ClinicId: id,
                },
                attributes: ['doctorId', 'provinceId']
            })
            data.doctorClinic = doctorClinic
        }

        return { status: 'OK', message: 'OK!', data: data }
    } catch (error) {
        throw error
    }
}

export const clinicService = {
    createClinic,
    getAllClinic,
    getDetailClinicById

}   