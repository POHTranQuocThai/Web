import express from 'express'
import bodyParser from 'body-parser'
import { configViewEngine } from './config/viewEngine'
import { initWebRoutes } from './route/web'
import { connectDB } from './config/connectDB'
import { env } from './config/environment'
import cors from 'cors'



const app = express()
//config app

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000', // Thay bằng domain của bạn
    credentials: true, // Cho phép gửi cookie hoặc xác thực
}))

configViewEngine(app)
initWebRoutes(app)

connectDB()

const port = env.PORT || 6969
app.listen(port, () => {
    console.log('Backend Nodejs is running on the port: localhost:' + port)

})

