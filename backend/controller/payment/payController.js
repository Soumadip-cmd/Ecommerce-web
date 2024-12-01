const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../../models/paymentModel");

// Payment checking
const PaymentCheck = async (req, res) => {
  try {
    const { amount } = req.body; // Changed from number to amount
    
    console.log("Received payment request for amount:", amount);
    
    if (!amount) {
      console.log("Amount is missing in request");
      return res.status(400).json({ 
        success: false,
        error: "Amount is required" 
      });
    }

    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await instance.orders.create(options);
    console.log("Razorpay order created:", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
      details: error.message,
      code: error.code
    });
  }
};


// Payment verify
const PaymentVerify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Missing required payment verification parameters"
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database comes here
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: order.amount 
      });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during verification"
    });
  }
};


const getPaymentDetails = async (req, res) => {
  try {
    const paymentId = req.query.reference; // Get reference from query params

    const payment = await Payment.findOne({
      razorpay_payment_id: paymentId
    }).sort({ createdAt: -1 });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment details not found"
      });
    }

    // Get order details from Razorpay
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const order = await instance.orders.fetch(payment.razorpay_order_id);

    res.status(200).json({
      success: true,
      order: {
        ...order,
        payment_id: payment.razorpay_payment_id
      }
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment details"
    });
  }
};


module.exports = { PaymentCheck, PaymentVerify,getPaymentDetails };