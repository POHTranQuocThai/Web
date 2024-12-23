import db from "../models"


const postBookAppointment = async (reqBody) => {
    try {
        if (!reqBody.email || !reqBody.doctorId || !reqBody.timeType || !reqBody.date) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }
        const user = await db.User.findOrCreate({
            where: { email: reqBody.email },
            defaults: {
                email: reqBody.email,
                roleId: 'R3'
            }
        })
        if (user && user[0]) {
            await db.Booking.findOrCreate({
                where: { patientId: user[0].id },
                defaults: {
                    statusId: 'S1',
                    doctorId: reqBody.doctorId,
                    patientId: user[0].id,
                    date: reqBody.date,
                    timeType: reqBody.timeType
                }
            })
        }
        return { status: 'OK', message: 'Save infor doctor succeed!' }
    } catch (error) {
        throw error
    }
}
export const patientService = {
    postBookAppointment
}