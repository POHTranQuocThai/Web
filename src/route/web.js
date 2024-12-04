import express from 'express'

const router = express.Router()

export const initWebRoutes = (app) => {
    router.get('/', (req, res) => { return res.send('Hello') })
    return app.use('/', router)
}



