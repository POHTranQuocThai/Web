import nodemailer from 'nodemailer'
import { env } from '../config/environment'

const sendSimpleEmail = async (dataSend) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: env.EMAIL_APP,
                pass: env.EMAIL_APP_PASSWORD
            }
        })
        const info = await transporter.sendMail({
            from: '"Thái Dev" <tranthai.070104@gmail.com>', // Địa chỉ email người gửi
            to: dataSend.reciverEmail, // Email người nhận (cách nhau bằng dấu phẩy)
            subject: "Thông tin đặt lịch khám bệnh", // Tiêu đề email
            html: getBodyHTMLEmail(dataSend)
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }

}
const getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        return result = `
                <h3>Xin chào ${dataSend.patientName}!</h3>
                <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
                <p>Thông tin đặt lịch khám bệnh:</p>
                <div><b>Thời gian: ${dataSend.time}</b></div>
                <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

                <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới 
                    để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh
                </p>
                <div>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
                </div>

                <div>Xin chân thành cảm ơn!</div>
                `// Nội dung dạng HTML
    } else if (dataSend.language === 'en') {
        return result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You have received this email because you scheduled an online medical appointment on Booking Care.</p>
        <p>Details of your appointment are as follows:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the information above is correct, please click the link below to confirm and complete the medical appointment booking process:</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Thank you very much!</div>
        `
    }
}
const getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        return result = `
                <h3>Xin chào ${dataSend.patientName}!</h3>
                <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
                <p>Thông tin đơn thuốc /hóa đơn được gửi trong file đính kèm.</p>       

                <div>Xin chân thành cảm ơn!</div>
                `// Nội dung dạng HTML
    } else if (dataSend.language === 'en') {
        return result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You have received this email because you scheduled an online medical appointment on Booking Care.</p>
        <p>Details of your appointment are as follows</p>


        <div>Thank you very much!</div>
        `
    }
}
const sendAttachment = async (dataSend) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: env.EMAIL_APP,
                pass: env.EMAIL_APP_PASSWORD
            }
        })
        const info = await transporter.sendMail({
            from: '"Thái Dev" <tranthai.070104@gmail.com>', // Địa chỉ email người gửi
            to: dataSend.email, // Email người nhận (cách nhau bằng dấu phẩy)
            subject: "Kết quả đặt lịch khám bệnh", // Tiêu đề email
            html: getBodyHTMLEmailRemedy(dataSend),
            attachments: [
                {
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split('base64')[1],
                    encoding: 'base64'
                }
            ]
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
export const emailService = {
    sendSimpleEmail,
    sendAttachment
}