// models/DeliveryPartner.js
const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicleType: String,
  email: {
  type: String,
  unique: true,
  sparse: true
},
  isAvailable: { type: Boolean, default: true },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
});

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
