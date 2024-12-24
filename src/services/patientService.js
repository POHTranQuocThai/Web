import db from "../models"
import { emailService } from "./emailService"


const postBookAppointment = async (reqBody) => {
    try {
        if (!reqBody.email || !reqBody.doctorId || !reqBody.timeType || !reqBody.date
            || !reqBody.fullname
        ) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }
        await emailService.sendSimpleEmail({
            reciverEmail: reqBody.email,
            patientName: reqBody.fullname,
            time: reqBody.timeString,
            doctorName: reqBody.doctorName,
            language: reqBody.language,
            redirectLink: "https://www.youtube.com/watch?v=0GL--Adfqhc"
        })
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