
const getHomePage = (req, res) => {
    return res.render('HomePage.ejs')
}

export const homeController = {
    getHomePage
}