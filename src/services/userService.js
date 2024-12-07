import db from "../models"
import bcrypt from 'bcryptjs'

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

        // Kiểm tra mật khẩu
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return { status: 'ERR', message: 'Email or Password is incorrect!' };
        }

        // Chỉ lấy email và roleid
        const filteredUser = {
            email: user.email,
            roleid: user.roleid, // Thay 'roleid' bằng tên chính xác trong database nếu cần
        };

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


export const userService = {
    handleUserLogin
}