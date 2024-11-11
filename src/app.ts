import express  from 'express'
import './database/connection'
import userRoute from './routes/userRoute'
import User from './database/models/userModel'

const app = express()
app.use(express.json())


// localhost:3000/api/auth/
app.use("/api/auth",userRoute)


export default app 


