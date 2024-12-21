import _ from "lodash";
import { env } from "../config/environment";
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
    try {
        console.log('🚀 ~ saveInfoDoctor ~ selectProvince:', reqBody.selectedProvince)
        console.log('🚀 ~ saveInfoDoctor ~ selectedPayment:', reqBody.selectedPayment)
        console.log('🚀 ~ saveInfoDoctor ~ reqBody.selectedPrice:', reqBody.selectedPrice)


        console.log('🚀 ~ saveInfoDoctor ~ reqBody.doctorId:', reqBody.doctorId)
        if (!reqBody.doctorId || !reqBody.contentHTML || !reqBody.contentMarkdown || !reqBody.action
            || !reqBody.priceId || !reqBody.paymentId || !reqBody.provinceId || !reqBody.nameClinic
            || !reqBody.addressClinic || !reqBody.note
        ) {
            return { status: 'ERR', message: 'Missing parameter' }
        }
        if (reqBody.action === 'CREATE') {
            await db.Markdown.create({
                ...reqBody
            })
        } else if (reqBody.action === 'EDIT') {
            const doctorMarkdown = await db.Markdown.findOne({
                where: { doctorId: reqBody.doctorId }
            })

            if (doctorMarkdown) {
                const { contentMarkdown, contentHTML, description } = reqBody
                const [updatedRows] = await db.Markdown.update({ contentMarkdown, contentHTML, description }, {
                    where: { doctorId: reqBody.doctorId },
                });
                if (updatedRows === 0) {
                    return { status: 'ERR', message: 'Edit doctor markdown unsuccessfully' };
                }
            }
        }
        const doctorInfor = await db.Doctor_Infor.findOne({
            where: { doctorId: reqBody.doctorId }
        })
        if (doctorInfor) {
            const [updatedRows] = await db.Doctor_Infor.update(reqBody, {
                where: { doctorId: reqBody.doctorId },
                raw: false
            });
            if (updatedRows === 0) {
                return { status: 'ERR', message: 'Edit doctor infor unsuccessfully' };
            }
            return { status: 'OK', message: 'Edit doctor infor successfully' };
        } else {
            await db.Doctor_Infor.create({
                ...reqBody
            });
            return { status: 'OK', message: 'Create doctor infor successfully' };
        }
    } catch (error) {
        throw error
    }
}
const getDetailDoctorById = async (inputId) => {
    try {
        if (!inputId) {
            return { status: 'ERR', message: 'Missing parameter' }
        }
        const doctor = await db.User.findOne({
            where: { id: inputId },
            attributes: { exclude: ['password'] },
            include: [
                { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'positionData' }
            ],
            raw: false,
            nest: true
        })
        if (doctor && doctor.image) {
            doctor.image = new Buffer.from(doctor.image, 'base64').toString('binary');

        }
        return { status: 'OK', message: 'Get all code successfully', data: doctor };
    } catch (error) {
        throw error
    }
}
const bulkCreateSchedule = async (data) => {
    try {
        if (!data.schedule || !data.doctorId || !data.date) {
            return { status: 'OK', message: 'Missing required parameter!' };
        }
        let schedule = data.schedule
        schedule = schedule?.map(item => {
            item.maxNumber = env.MAX_NUMBER_SCHEDULE
            return item
        })
        let existing = await db.Schedule.findAll({
            where: { doctorId: data.doctorId, date: data.date },
            attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
            raw: true
        })
        existing = existing?.map(item => {
            item.date = new Date(item.data).getTime()
            return item
        })
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
            return a.timeType === b.timeType && +a.date === +b.date
        })
        if (toCreate && toCreate.length > 0) {
            await db.Schedule.bulkCreate(toCreate)
        }
        return { status: 'OK', message: 'Create schedule successfully' };
    } catch (error) {
        throw error
    }
}
const getScheduleByDate = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return { status: 'OK', message: 'Missing required parameter!' };
        }
        const data = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: date
            },
            include: [
                { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'timeTypeData' }
            ],
            raw: false,
            nest: true
        })
        if (!data) {
            data = []
        }
        return { status: 'OK', message: 'Get schedule successfully', data: data };
    } catch (error) {
        throw error
    }
}
export const doctorService = {
    getTopDoctorHome,
    getAllDoctors,
    saveInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate
}