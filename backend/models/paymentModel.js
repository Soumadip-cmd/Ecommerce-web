const mongoose =require('mongoose')
const { Schema } = mongoose;

// models/paymentModel.js
const paymentSchema = new Schema({
      razorpay_order_id: {
        type: String,
        required: true,
      },
      razorpay_payment_id: {
        type: String,
        required: true,
      },
      razorpay_signature: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: 'success'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

module.exports= mongoose.model('Payment', paymentSchema);