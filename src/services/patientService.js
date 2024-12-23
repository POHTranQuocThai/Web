import db from "../models"


const postBookAppointment = async (reqBody) => {
    console.log('🚀 ~ postBookAppointment ~ reqBody:', reqBody)
    try {
        console.log('🚀 ~ postBookAppointment ~ reqBody.email:', reqBody.email, reqBody.date)
        console.log('🚀 ~ postBookAppointment ~ reqBody.email || !reqBody.doctorId || !reqBody.timeType || !reqBody.date:', reqBody.email, !reqBody.doctorId, !reqBody.timeType, !reqBody.date)
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