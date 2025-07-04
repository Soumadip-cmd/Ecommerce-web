require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Razorpay = require('razorpay');
const connectDB = require('./config/db');
const router = require('./routes');
connectDB();

const app = express();

app.use(express.json({ limit: "50mb" })); // Adjust limit as needed
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Allow credentials and set CORS origin
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Set-Cookie'],
    // Increase preflightContinue timeout if needed
    optionsSuccessStatus: 200,
    preflightContinue: false,
}));
app.use(cookieParser());

// Define a route where cookies will be set
app.use("/api", router);

const PORT = process.env.PORT || 8088;

app.listen(PORT, () => {
    
    console.log("Server is running on port " + PORT);
});
