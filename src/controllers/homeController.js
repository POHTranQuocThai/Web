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

export const homeController = {
    getHomePage
}