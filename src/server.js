import express from 'express'
import bodyParser from 'body-parser'
import { configViewEngine } from './config/viewEngine'
import { initWebRoutes } from './route/web'
import dotenv from 'dotenv'
dotenv.config()


const app = express()
//config app

app.use(bodyParser.json())

configViewEngine(app)
initWebRoutes(app)

const port = process.env.PORT || 6969
app.listen(port, () => {
    console.log('Backend Nodejs is running on the port: localhost:' + port)

})

