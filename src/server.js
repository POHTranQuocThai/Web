import express from 'express'
import bodyParser from 'body-parser'
import { configViewEngine } from './config/viewEngine'
import { initWebRoutes } from './route/web'
import { connectDB } from './config/connectDB'
import { env } from './config/environment'



const app = express()
//config app

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

configViewEngine(app)
initWebRoutes(app)

connectDB()

const port = env.PORT || 6969
app.listen(port, () => {
    console.log('Backend Nodejs is running on the port: localhost:' + port)

})

