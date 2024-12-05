import db from '../models'

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