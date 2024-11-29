const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});


// Create Payment Order
const PaymentCheck = (req, res) => {
  const { amount } = req.body; 
  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
  };

  instance.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create order", details: err });
    }
    res.status(200).json(order);
  });
};



// Verify Payment
const PaymentVerify = (req, res) => {
  
  res.status(200).json({ message: "Successfully Verified" });
};

module.exports = { PaymentCheck, PaymentVerify };
