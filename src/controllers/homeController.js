import db from '../models'
import { CRUDService } from '../services/CRUDService'

const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll()
        return res.render('HomePage.ejs', { data: JSON.stringify(data) })
    } catch (error) {
        console.log('🚀 ~ getHomePage ~ error:', error)
    }
}
const getCrudPage = async (req, res) => {
    return res.render('Crud.ejs')
}
const postCRUD = async (req, res) => {
    const createUser = await CRUDService.createNewUser(req.body)
    res.status(201).json(createUser)
}
const displayGetCRUD = async (req, res) => {
    const users = await CRUDService.getAllUser()
    console.log('🚀 ~ displayGetCRUD ~ users:', users)

    return res.send('hhhh')
}

export const homeController = {
    getHomePage,
    getCrudPage,
    displayGetCRUD,
    postCRUD
}