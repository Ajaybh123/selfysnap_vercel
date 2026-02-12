
const OrderService = require("../services/OrderService");
const CartService = require("../services/CartService");
const UserService = require("../services/UserService");
const OrderError = require("../exceptions/OrderError");
const PaymentMethod = require("../domain/PaymentMethod");
const PaymentService = require("../services/PaymentService");
const PaymentOrder = require("../models/PaymentOrder");


class OrderController {
  // Admin: Get all orders
  async getAllOrdersForAdmin(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
  }

  // Assign delivery partner to order
  async assignDeliveryPartner(req, res) {
    try {
      const { orderId } = req.params;
      const { deliveryPartnerId } = req.body;

      const updatedOrder =
        await OrderService.assignDeliveryPartner(
          orderId,
          deliveryPartnerId
        );

      return res.status(200).json({
        success: true,
        message: "Delivery partner assigned successfully",
        order: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateDeliveryStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const updatedOrder =
        await OrderService.updateDeliveryStatus(
          orderId,
          status
        );

      return res.status(200).json({
        success: true,
        message: "Delivery status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Create a new order
  async createOrder(req, res, next) {

    const { shippingAddress } = req.body;
    const { paymentMethod } = req.query;
    const jwt = req.headers.authorization;

    try {
      const user = await req.user;
      const cart = await CartService.findUserCart(user);
      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty. Please add items before placing an order." });
      }
      if (!shippingAddress) {
        return res.status(400).json({ message: "Shipping address is required." });
      }
      if (!paymentMethod) {
        return res.status(400).json({ message: "Payment method is required." });
      }
      const orders = await OrderService.createOrder(user, shippingAddress, cart);
      if (!orders || orders.length === 0) {
        return res.status(400).json({ message: "Order could not be created. Please try again." });
      }
      const paymentOrder = await PaymentService.createOrder(user, orders, paymentMethod);
      const response = {};
      if (paymentMethod === PaymentMethod.RAZORPAY) {
        const payment = await PaymentService.createRazorpayPaymentLink(user, paymentOrder.amount, paymentOrder._id);
        const paymentUrl = payment.short_url;
        const paymentUrlId = payment.id;
        response.payment_link_url = paymentUrl;
        paymentOrder.paymentLinkId = paymentUrlId;
        await PaymentOrder.findByIdAndUpdate(paymentOrder._id, paymentOrder);
      } else if (paymentMethod === 'COD') {
        response.message = 'Order placed successfully with Cash on Delivery.';
      }
      return res.status(200).json(response);

    } catch (error) {
      console.log("error ", error)
      return res.status(500).json({ message: `Error creating order: ${error.message || error}` });
    }
  }

  // Get order by ID
  async getOrderById(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.findOrderById(orderId);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getOrderItemById(req, res, next) {
    try {
      const { orderItemId } = req.params;
      const orderItem = await OrderService.findOrderItemById(orderItemId);
      return res.status(200).json(orderItem);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  // Get user's order history
  async getUserOrderHistory(req, res) {
    // console.log("req ",req.user)
    try {
      const userId = await req.user._id;
      const orderHistory = await OrderService.usersOrderHistory(userId);
      return res.status(200).json(orderHistory);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  // Get orders for a specific seller (shop)
  async getSellersOrders(req, res) {
    try {
      const sellerId = req.seller._id
      const orders = await OrderService.getShopsOrders(sellerId);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { orderId, orderStatus } = req.params;

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        orderStatus
      );
      return res
        .status(200)
        .json(updatedOrder);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  // Cancel an order
  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;
      const canceledOrder = await OrderService.cancelOrder(orderId, userId);
      return res
        .status(200)
        .json({
          message: "Order cancelled successfully",
          order: canceledOrder,
        });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  // Delete an order
  async deleteOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      await OrderService.deleteOrder(orderId);
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
