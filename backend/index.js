const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
connectDB()



const app = express()

app.use(express.json({ limit: "50mb" })); // adjust "10mb" to your needs
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api",router)






const PORT = 8088 || process.env.PORT



app.listen(PORT,()=>{
    console.log("connnect to DB")
    console.log("Server is running "+PORT)
})

