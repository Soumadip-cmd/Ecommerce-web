const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePic: String,
    role: String,
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel