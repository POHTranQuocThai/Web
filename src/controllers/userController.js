import { userService } from "../services/userService"


const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(404).json({ message: 'Missing inputs parameter!' })
    }
    const userData = await userService.handleUserLogin(email, password)
    res.status(200).json(userData)
}
const getAllUser = async (req, res) => {
    try {
        const userId = req.query.id
        const userData = await userService.getAllUser(userId)
        return res.status(200).json(userData)
    } catch (error) {

    }
}
const createNewUser = async (req, res) => {
    const createUser = await userService.createNewUser(req.body)
    res.status(201).json(createUser)
}

const editUser = async (req, res) => {
    try {
        const userId = req.body.id
        if (!userId) {
            return res.status(404).json({ status: 'ERR', message: 'Missing required parameters!' })
        }
        const userData = await userService.editUser(userId, req.body)
        res.status(200).json(userData)
    } catch (error) {

    }
}

const deleteUser = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(404).json({ status: 'ERR', message: 'Missing required parameters!' })
        }
        const userData = await userService.deleteUser(req.body.userId)
        res.status(200).json(userData)
    } catch (error) {

    }
}
const getAllCode = async (req, res) => {
    try {
        const data = await userService.getAllCode(req.query.type)
        res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            status: 'ERR',
            message: 'Error' + error
        })
    }
}
export const userController = {
    login,
    getAllUser,
    createNewUser,
    editUser,
    deleteUser,
    getAllCode

}