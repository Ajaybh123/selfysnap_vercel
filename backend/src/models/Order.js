const mongoose = require('mongoose');
const OrderStatus = require('../domain/OrderStatus');
const PaymentStatus = require('../domain/PaymentStatus');
const { Schema } = mongoose;

const orderSchema = new Schema({

 user:{
  type:Schema.Types.ObjectId,
  ref:'User',
  required:true
 },

 seller:{
  type:Schema.Types.ObjectId,
  ref:'Seller',
  required:true
 },

 orderItems:[
  {
   type:Schema.Types.ObjectId,
   ref:'OrderItem'
  }
 ],

 shippingAddress:{
  type:Schema.Types.ObjectId,
  ref:'Address',
  required:true
 },

 totalMrpPrice:Number,
 totalSellingPrice:Number,
 discount:{type:Number,default:0},

 orderStatus:{
  type:String,
  enum:Object.values(OrderStatus),
  default:OrderStatus.PENDING
 },

 totalItem:Number,

 paymentStatus:{
  type:String,
  enum:Object.values(PaymentStatus),
  default:PaymentStatus.PENDING
 },

 orderDate:{
  type:Date,
  default:Date.now,
  index:true
 },

 deliverDate:{
  type:Date,
  default:()=>Date.now()+7*24*60*60*1000
 },

 deliveredAt:{
  type:Date,
  default:null
 },

 commission:{
  type:Number,
  default:0
 },

 deliveryPartner:{
  type:Schema.Types.ObjectId,
  ref:'DeliveryPartner',
  default:null
 },

 deliveryAssignedAt:{
  type:Date,
  default:null
 }

},{timestamps:true});

module.exports = mongoose.model('Order',orderSchema);
