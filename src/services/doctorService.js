import db from "../models"

const getTopDoctorHome = async (limit) => {
    try {
        const users = await db.User.findAll({
            limit: Number(limit),
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] },
            ],
            nest: true,
            raw: true,
        });
        return { status: 'OK', data: users, message: 'Get users sorted desc order successfully!' };
    } catch (error) {
        console.error('Error in getTopDoctorHome:', error.message);
        throw new Error('Database query failed');
    }
}
const getAllDoctors = async () => {
    try {
        const doctors = await db.User.findAll({
            where: { roleId: 'R2' },
            attributes: { exclude: ['password', 'image'] },

        })
        return { status: 'OK', message: 'Get all code successfully', data: doctors };
    } catch (error) {
        throw error
    }
}
const saveInfoDoctor = async (reqBody) => {
    console.log('🚀 ~ saveInfoDoctor ~ reqBody:', reqBody)
    try {
        if (!reqBody.doctorId || !reqBody.contentHTML || !reqBody.contentMarkdown) {
            return { status: 'ERR', message: 'Missing parameter' }
        } else {
            await db.Markdown.create({
                ...reqBody
            })
        }
        return { status: 'OK', message: 'Get all code successfully' };
    } catch (error) {
        throw error
    }
}
export const doctorService = {
    getTopDoctorHome,
    getAllDoctors,
    saveInfoDoctor
}