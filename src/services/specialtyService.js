import db from "../models"

const createSpecialty = async (reqBody) => {
    try {
        if (!reqBody.name || !reqBody.imageBase64 || !reqBody.descriptionHTML || !reqBody.descriptionMarkdown) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }
        await db.Specialty.create({
            name: reqBody.name,
            image: reqBody.imageBase64,
            descriptionHTML: reqBody.descriptionHTML,
            descriptionMarkdown: reqBody.descriptionMarkdown
        })
        return { status: 'OK', message: 'OK!' }

    } catch (error) {
        throw error
    }
}
const getAllSpecialty = async () => {
    try {
        const data = await db.Specialty.findAll()
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
const getDetailSpecialtyById = async (id, location) => {
    try {
        if (!id || !location) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }

        const data = await db.Specialty.findOne({
            where: { id: id },
            attributes: ['descriptionHTML', 'descriptionMarkdown']
        })
        if (data) {
            let doctorSpecialty = []
            if (location === 'ALL') {
                doctorSpecialty = await db.Doctor_Infor.findAll({
                    where: { specialtyId: id },
                    attributes: ['doctorId', 'provinceId']
                })
            } else {
                doctorSpecialty = await db.Doctor_Infor.findAll({
                    where: {
                        specialtyId: id,
                        provinceId: location
                    },
                    attributes: ['doctorId', 'provinceId']
                })
            }
            data.doctorSpecialty = doctorSpecialty
        }
        return { status: 'OK', message: 'OK!', data: data }
    } catch (error) {
        throw error
    }
}

export const specialtyService = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}   