import { userService } from "../services/userService"


const login = async (req, res) => {
    const email = req.body.email
    console.log('🚀 ~ login ~ email:', email)
    const password = req.body.password
    if (!email || !password) {
        return res.status(404).json({ message: 'Missing inputs parameter!' })
    }
    const userData = await userService.handleUserLogin(email, password)
    return res.status(200).json(userData)
}
export const userController = {
    login
}