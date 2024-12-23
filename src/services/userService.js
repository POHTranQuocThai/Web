import { where } from "sequelize";
import db from "../models"
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10)

const handleUserLogin = async (email, password) => {
    try {
        // Kiểm tra email tồn tại
        const isExist = await checkUserEmail(email);
        if (!isExist) {
            return { status: 'ERR', message: 'Your Email does not exist!' };
        }

        // Tìm kiếm thông tin người dùng
        const user = await db.User.findOne({
            where: { email: email },
            raw: true,
        });

        if (!user) {
            return { status: 'ERR', message: 'Your Email does not exist!' };
        }
        const hashedPassword = await bcrypt.hash(password, salt);
        // Kiểm tra mật khẩu
        const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
        if (!isPasswordValid) {
            return { status: 'ERR', message: 'Email or Password is incorrect!' };
        }

        // Chỉ lấy email và roleid
        const filteredUser = {
            email: user.email,
            roleId: user.roleId, // Thay 'roleid' bằng tên chính xác trong database nếu cần
            firstName: user.firstName,
            lastName: user.lastName
        };
        console.log('🚀 ~ handleUserLogin ~ filteredUser:', filteredUser)

        return { status: 'OK', message: 'User information validated!', user: filteredUser };

    } catch (error) {
        // Bắt lỗi và trả về
        console.error('Error in handleUserLogin:', error);
        throw new Error('Internal server error');
    }
}

const checkUserEmail = async (userEmail) => {
    try {
        const user = await db.User.findOne({
            where: { email: userEmail },
        });
        return !!user; // Trả về true nếu user tồn tại, ngược lại false
    } catch (error) {
        console.error('Error in checkUserEmail:', error);
        throw new Error('Internal server error');
    }
};

const getAllUsers = async (userId) => {
    try {
        let users = []
        if (userId === 'All') {
            users = await db.User.findAll({ raw: true })
        }
        if (userId && userId !== 'All') {
            users = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
        }

        if (!users) {
            return { status: 'ERR', message: 'Users are not exists!' }
        }
        delete users.password
        return { status: 'OK', message: 'Get user successfully!', users: users }
    } catch (error) { throw error }
}
const createNewUser = (reqBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkEmail = await checkUserEmail(reqBody.email)
            if (checkEmail) {
                resolve({ status: 'ERR', message: 'Your email is already used!' })
                return
            }
            const hashPasswordFromBcrypt = await hashUserPassword(reqBody.password)
            await db.User.create({
                ...reqBody,
                password: hashPasswordFromBcrypt
            })
            resolve({ status: 'OK', message: 'Create a new user successfully!' })
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
const editUser = async (userId, newData) => {
    try {

        if (newData.image && newData.image.type === 'Buffer') {
            newData.image = Buffer.from(newData.image.data); // Lưu trực tiếp Buffer
        }

        const [updatedRows] = await db.User.update(newData, {
            where: { id: userId },
        });
        if (updatedRows === 0) {
            return { status: 'ERR', message: 'User not found or no change applied' };
        }

        return { status: 'OK', message: 'User updated successfully' };
    } catch (error) {
        return { status: 'ERR', message: error.message };
    }
};
const deleteUser = async (userId) => {
    try {
        const rowsDeleted = await db.User.destroy({
            where: { id: userId }
        });

        if (rowsDeleted === 0) {
            return { status: 'ERR', message: 'User does not exist' };
        }

        return { status: 'OK', message: 'User deleted successfully' };
    } catch (error) {
        return { status: 'ERR', message: error.message || 'An error occurred while deleting the user' };
    }
}
const getAllCode = async (typeInput) => {
    try {
        if (!typeInput) {
            return { status: 'ERR', message: 'Type input does not exist' };
        }
        const allCode = await db.Allcode.findAll({
            where: { type: typeInput }
        })
        return { status: 'OK', message: 'Get all code successfully', data: allCode };

    } catch (error) {
        throw error
    }
}
export const userService = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    editUser,
    deleteUser,
    getAllCode,

}