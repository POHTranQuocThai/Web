import db from "../models"
import bcrypt from 'bcryptjs'

const hanldeUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isExist = await checkUserEmail(email)
            if (isExist) {
                const user = await db.User.findOne({
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    const checkPassValid = bcrypt.compareSync(password, user.password)
                    if (checkPassValid) {
                        delete user.password
                        resolve({ status: 'OK', message: 'User information valided!', user: user })
                    } else {
                        resolve({ status: 'OK', message: 'Password wrong!' })
                    }
                } else {
                    resolve({ status: 'ERR', message: 'Your Email is not exists!' })
                }
                resolve(true)
            } else {
                resolve({ status: 'ERR', message: 'Your Email is not exists!' })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (!user) {
                resolve(false)
            } else {
                resolve(true)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const userService = {
    hanldeUserLogin
}