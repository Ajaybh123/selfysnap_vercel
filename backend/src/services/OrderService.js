const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");
const User = require("../models/User");
const OrderItem = require("../models/OrderItem");
const CartItem = require("../models/CartItem");
const CartService = require("../services/CartService");
const OrderError = require("../exceptions/OrderError");
const OrderStatus = require("../domain/OrderStatus");
const PaymentStatus = require("../domain/PaymentStatus");
const mongoose = require("mongoose");
const TransactionService = require("./TransactionService");
const DeliveryPartner = require("../models/DeliveryPartner");


class OrderService {
  // Admin: Get all orders
  async getAllOrders() {
    const orders = await Order.find().populate('user').populate('seller').populate('deliveryPartner');
    console.log("orders ", orders)
    return orders;
  }
  // Assign delivery partner to order
  async assignDeliveryPartner(orderId, deliveryPartnerId) {
  const order = await this.findOrderById(orderId);
  if (!order) throw new OrderError("Order not found");

  const partner = await DeliveryPartner.findById(deliveryPartnerId);
  if (!partner) throw new OrderError("Delivery partner not found");

  if (!partner.isAvailable) {
    throw new OrderError("Partner is not available");
  }

  // ✅ Update Order
  order.deliveryPartner = deliveryPartnerId;
  order.orderStatus = "ASSIGNED";
  await order.save();

  // ✅ Update Delivery Partner
  partner.currentOrder = orderId;
  partner.isAvailable = false;
  await partner.save();

  return order;
}

  // Update delivery status
 async updateDeliveryStatus(orderId, status) {
  const order = await this.findOrderById(orderId);
  if (!order) throw new OrderError("Order not found");

  order.orderStatus = status;
  await order.save();

  // delivery complete -> partner free
  if (status === "DELIVERED" && order.deliveryPartner) {
    await DeliveryPartner.findByIdAndUpdate(order.deliveryPartner, {
      currentOrder: null,
      isAvailable: true,
    });
  }

  return order;
}


  async createOrder(user, shippingAddress, cart) {
    console.log("shpping address: start", shippingAddress);
    try {
      if (shippingAddress._id && !user.addresses.includes(shippingAddress._id)) {
        user.addresses.push(shippingAddress._id);
        await User.findByIdAndUpdate(user._id, user);
      }

      if (!shippingAddress._id) {
        // Check if address already exists for user
        const existing = await Address.findOne({
          name: shippingAddress.name,
          mobile: shippingAddress.mobile,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pinCode: shippingAddress.pinCode
        });
        if (existing) {
          shippingAddress = existing;
        } else {
          shippingAddress = await Address.create(shippingAddress);
        }
        // Only add if not already present
        if (!user.addresses.includes(shippingAddress._id)) {
          user.addresses.push(shippingAddress._id);
          await User.findByIdAndUpdate(user._id, user);
        }
      }

      // Prevent empty cart
      if (!cart.cartItems || cart.cartItems.length === 0) {
        throw new Error("Cart is empty. Cannot create order.");
      }

      const itemsBySeller = cart.cartItems.reduce((acc, item) => {
        const sellerId = item.product.seller._id.toString();
        acc[sellerId] = acc[sellerId] || [];
        acc[sellerId].push(item);
        return acc;
      }, {});

      const orders = new Set();

      for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
        if (!cartItems || cartItems.length === 0) continue;
        const totalOrderPrice = cartItems.reduce(
          (sum, item) => sum + item.sellingPrice,
          0
        );
        const totalItemCount = cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        // Commission logic: 10% commission per order
        const commission = Math.round(totalOrderPrice * 0.10);

        // Create the new order
        const newOrder = new Order({
          user: user._id,
          seller: sellerId,
          totalMrpPrice: totalOrderPrice,
          totalSellingPrice: totalOrderPrice,
          totalItem: totalItemCount,
          shippingAddress: shippingAddress._id,
          orderStatus: OrderStatus.PENDING,
          paymentDetails: { status: PaymentStatus.PENDING },
          orderItems: [],
          commission,
        });

        // Save each order item
        const orderItems = await Promise.all(
          cartItems.map(async (cartItem) => {
            const orderItem = new OrderItem({
              mrpPrice: cartItem.mrpPrice,
              product: cartItem.product._id,
              quantity: cartItem.quantity,
              size: cartItem.size,
              userId: cartItem.userId,
              sellingPrice: cartItem.sellingPrice,
            });

            const savedOrderItem = await orderItem.save();
            newOrder.orderItems.push(savedOrderItem._id);
            return savedOrderItem;
          })
        );

        if (newOrder.orderItems.length === 0) continue;
        const savedOrder = await newOrder.save();
        TransactionService.createTransaction(savedOrder._id)
        orders.add(savedOrder);
      }

      // Clear user's cart after order creation
      if (cart && cart._id) {
        await Cart.findByIdAndUpdate(cart._id, { cartItems: [] });
        await CartItem.deleteMany({ cart: cart._id });
      }

      return Array.from(orders);
    } catch (error) {
      console.log("orderr error ", error)
      throw new Error(error.message)
    }
  }

  async findOrderById(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new OrderError("Invalid Order ID...");
    }
    // console.log("order id ",orderId)
    const order = await Order.findById(orderId).populate([
      { path: "seller" },
      { path: "shippingAddress" },
      { path: "orderItems", populate: { path: "product" } },
    ]);

    if (!order) {
      throw new OrderError(`Order not found with id ${orderId}`);
    }
    return order;
  }

  async findOrderItemById(orderItemId) {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new OrderError("Invalid Order Item ID...");
    }
    // console.log("order id ",orderId)
    const order = await OrderItem.findById(orderItemId).populate([
      { path: "product", populate: { path: "seller" } },
    ]);

    if (!order) {
      throw new OrderError(`Order not found with id ${orderId}`);
    }
    return order;
  }

  async usersOrderHistory(userId) {
    return await Order.find({ user: userId }).populate([
      { path: "seller" },
      { path: "shippingAddress" },
      { path: "orderItems", populate: { path: "product" } },
    ]);
  }

  async getShopsOrders(sellerId) {
    return await Order.find({ seller: sellerId })
      .sort({ orderDate: -1 })
      .populate([
        { path: "seller" },
        { path: "shippingAddress" },
        { path: "orderItems", populate: { path: "product" } },
      ]);
  }

  async updateOrderStatus(orderId, orderStatus) {
    const order = await this.findOrderById(orderId);

    order.orderStatus = orderStatus;

   
    return await Order.findByIdAndUpdate(orderId, order, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "seller" },
      { path: "shippingAddress" },
      { path: "orderItems", populate: { path: "product" } },
    ]);
  }

  async deleteOrder(orderId) {
    const order = await this.findOrderById(orderId);
    if (!order) {
      throw new OrderError(`Order not found with id ${orderId}`);
    }
    return await Order.deleteOne({ _id: orderId });
  }

  async cancelOrder(orderId, user) {
    const order = await this.findOrderById(orderId);
    if (user._id.toString() !== order.user.toString()) {
      throw new OrderError(
        `You can't perform this action on order id ${orderId}`
      );
    }
    order.orderStatus = OrderStatus.CANCELLED;
    return await Order.findByIdAndUpdate(orderId, order, { new: true });
  }
}

module.exports = new OrderService();
