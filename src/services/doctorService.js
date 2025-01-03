import _ from "lodash";
import { env } from "../config/environment";
import db from "../models"
import { emailService } from "./emailService";

const getTopDoctorHome = async (limit) => {
    try {
        const users = await db.User.findAll({
            limit: Number(limit),
            where: { roleId: 'R2' },
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] },
            ],
            raw: true,
            nest: true,
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
const checkRequiredFields = (input) => {
    const requiredFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'priceId', 'paymentId', 'provinceId', 'nameClinic',
        'addressClinic', 'note', 'specialtyId'
    ];
    for (const field of requiredFields) {
        if (!input[field] || input[field] === '') {
            return {
                isValid: false,
                element: field
            };
        }
    }
    return {
        isValid: true,
        element: ''
    };
};
const saveInfoDoctor = async (reqBody) => {
    try {
        const checkObj = checkRequiredFields(reqBody)
        if (!checkObj.isValid) {
            return { status: 'ERR', message: 'Missing parameter ' + checkObj.element }
        }
        if (reqBody.action === 'ADD') {
            const { contentMarkdown, contentHTML, description, doctorId, clinicId, specialtyId } = reqBody;
            const res = await db.Markdown.create({ contentMarkdown, contentHTML, description, doctorId, specialtyId, clinicId });

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
            return { status: 'OK', message: 'Updated doctor infor successfully' };
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
                {
                    model: db.Doctor_Infor,
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'priceTypeData' },
                        { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'paymentTypeData' },
                        { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'provinceTypeData' }
                    ]
                },
                { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'positionData' }
            ],
            raw: false,
            nest: true
        })
        if (doctor && doctor.image) {
            doctor.image = new Buffer.from(doctor.image, 'base64').toString('binary');
        }
        return { status: 'OK', message: 'Get all code successfully', data: doctor ? doctor : {} };
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
            where: { doctorId: data.doctorId, date: '' + data.date },
            attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
            raw: true
        })
        existing = existing?.map(item => {
            item.date = new Date(item.date).getTime()
            return item
        })
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
            a.date = new Date(a.date).getTime();  // Chuyển chuỗi ngày thành timestamp
            b.date = new Date(b.date).getTime();  // Chuyển chuỗi ngày thành timestamp
            return a.timeType === b.timeType && a.date === b.date;
        });
        if (toCreate && toCreate.length > 0) {
            await db.Schedule.bulkCreate(toCreate, { ignoreDuplicates: true })
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
                { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'timeTypeData' },
                { model: db.User, attributes: ['firstName', 'lastName'], as: 'doctorData' }
            ],
            raw: true,
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
const getExtraInforDoctorById = async (doctorId) => {
    try {
        if (!doctorId) {
            return { status: 'ERR', message: 'Missing required parameter!' };
        } else {
            const data = await db.Doctor_Infor.findOne({
                where: { doctorId: doctorId },
                attributes: { exclude: ['id', 'doctorId'] },
                include: [

                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                ],
                raw: false,
                nest: true
            })
            return { status: 'OK', message: 'Get schedule successfully', data: data ? data : {} };
        }
    } catch (error) {
        throw error
    }

}
const getProfileDoctorById = async (doctorId) => {
    try {
        if (!doctorId) {
            return { status: 'ERR', message: 'Missing required parameter!' };
        } else {
            const doctor = await db.User.findOne({
                where: { id: doctorId },
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: { exclude: ['id', 'doctorId'] },
                        include: [
                            { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'priceTypeData' },
                            { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'paymentTypeData' },
                            { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'provinceTypeData' }
                        ]
                    },
                    { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'positionData' }
                ],
                raw: false,
                nest: true
            })
            if (doctor && doctor.image) {
                doctor.image = new Buffer.from(doctor.image, 'base64').toString('binary');
            }
            return { status: 'OK', message: 'Get schedule successfully', data: doctor ? doctor : {} };
        }
    } catch (error) {
        throw error
    }

}
const getListPatientForDoctor = async (doctorId, date) => {

    try {
        if (!doctorId || !date) {
            return { status: 'ERR', message: 'Missing required parameter!' };
        } else {
            const data = await db.Booking.findAll({
                where: {
                    statusId: 'S2',
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {
                        model: db.User, attributes: ['email', 'firstName', 'address', 'gender'], as: 'patientData',
                        include: [
                            { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'genderData' },
                        ]
                    },
                    { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'timeTypeDataPatient' },

                ],
                raw: true,
                nest: true
            })
            return { status: 'OK', message: 'Get schedule successfully', data: data ? data : {} };
        }
    } catch (error) {
        throw error
    }

}
const sendRemedy = async (reqBody) => {

    try {
        if (!reqBody.email || !reqBody.doctorId || !reqBody.patientId) {
            return { status: 'ERR', message: 'Missing required parameter!' };
        }
        const appointment = await db.Booking.findOne({
            where: {
                doctorId: reqBody.doctorId,
                patientId: reqBody.patientId,
                timeType: reqBody.timeType,
                statusId: 'S2'
            },
            raw: false
        })
        if (appointment) {
            appointment.statusId = 'S3'
            await appointment.save()
        }
        await emailService.sendAttachment(reqBody)
        return { status: 'OK', message: 'Send remedy successfully' };
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
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}