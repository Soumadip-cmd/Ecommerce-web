const mongoose = require("mongoose")


 function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    console.log("Database Connected..!")
}

module.exports = connectDB