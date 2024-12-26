import { env } from "../config/environment"
import db from "../models"
import { emailService } from "./emailService"
import { v4 as uuidv4 } from 'uuid'

const buildUrlEmail = (doctorId, token) => {
    const result = `${env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
const postBookAppointment = async (reqBody) => {
    try {
        if (!reqBody.email || !reqBody.doctorId || !reqBody.timeType || !reqBody.date || !reqBody.fullname) {
            return { status: 'ERR', message: 'Missing required parameter!' };
        }

        const token = uuidv4();

        // Tạo Promise gửi email (không chờ ở đây)
        const emailPromise = emailService.sendSimpleEmail({
            reciverEmail: reqBody.email,
            patientName: reqBody.fullname,
            time: reqBody.timeString,
            doctorName: reqBody.doctorName,
            language: reqBody.language,
            redirectLink: buildUrlEmail(reqBody.doctorId, token),
        });

        // Tìm hoặc tạo User
        const [user, created] = await db.User.findOrCreate({
            where: { email: reqBody.email },
            defaults: {
                email: reqBody.email,
                roleId: 'R3',
            },
        });

        // Đợi cả hai Promise cùng hoàn tất
        await Promise.all([emailPromise]);

        // Tạo Booking nếu User tồn tại
        if (user) {
            await db.Booking.findOrCreate({
                where: { patientId: user.id },
                defaults: {
                    statusId: 'S1',
                    doctorId: reqBody.doctorId,
                    patientId: user.id,
                    date: reqBody.date,
                    timeType: reqBody.timeType,
                    token: token,
                },
            });
            return { status: 'OK', message: 'Save info doctor succeed!' };
        }
    } catch (error) {
        console.error('Error in postBookAppointment:', error);
    }
};

const postVerifyBookAppointment = async (reqBody) => {
    try {
        if (!reqBody.doctorId || !reqBody.token) {
            return { status: 'ERR', message: 'Missing required parameter!' }
        }
        const appointment = await db.Booking.findOne({
            where: {
                doctorId: reqBody.doctorId,
                token: reqBody.token,
                statusId: 'S1'
            },
            raw: false
        })
        if (appointment) {
            appointment.statusId = 'S2'
            await appointment.save()
            return { status: 'OK', message: 'Update the appointment succeed!' }
        }
    } catch (error) {
        throw error
    }
}
export const patientService = {
    postBookAppointment,
    postVerifyBookAppointment
}