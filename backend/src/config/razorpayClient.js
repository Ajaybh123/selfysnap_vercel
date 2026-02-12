const Razorpay = require('razorpay');

const apiKey = "rzp_test_Ra1GSwSxjibJJZ";
const apiSecret = "5BXnAljHReNVKYzznxlaBrOC";


const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports = razorpay;