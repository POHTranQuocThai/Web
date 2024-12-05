import bcrypt from 'bcryptjs'
import db from '../models/index'
const salt = bcrypt.genSaltSync(10)
const createNewUser = async (reqBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPasswordFromBcrypt = await hashUserPassword(reqBody.password)
            await db.User.create({
                ...reqBody,
                password: hashPasswordFromBcrypt,
                gender: reqBody.gender === '1' ? true : false
            })
            resolve('Create a new user successfully!')
        } catch (error) {
            reject(error)
        }
    })
}
const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}
export const CRUDService = {
    createNewUser
}