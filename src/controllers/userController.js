import { userService } from "../services/userService"


const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(200).json({ message: 'Missing inputs parameter!' })
    }
    const userData = await userService.hanldeUserLogin(email, password)
    return res.status(200).json(userData.user ? userData : {})
}
export const userController = {
    login
}