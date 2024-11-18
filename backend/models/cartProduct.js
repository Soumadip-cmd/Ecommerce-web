// const mongoose = require('mongoose')

// const addToCart = mongoose.Schema({
//    productId : {
//         ref : 'product',
//         type : String,
//    },
//    quantity : Number,
//    userId : String,
// },{
//     timestamps : true
// })


// const addToCartModel = mongoose.model("addToCart",addToCart)

// module.exports = addToCartModel


const mongoose = require('mongoose')

const addToCart = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,  // Changed from String to ObjectId
        ref: 'product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Changed from String to ObjectId
        ref: 'user',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

const addToCartModel = mongoose.model("addToCart",addToCart)

module.exports = addToCartModel