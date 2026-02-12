const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
// Admin: Get all orders
router.get('/admin', adminAuthMiddleware, orderController.getAllOrdersForAdmin);

router.put(
  "/:orderId/assign-delivery",
  adminAuthMiddleware,
  orderController.assignDeliveryPartner
);

router.put(
  "/:orderId/delivery-status",
  adminAuthMiddleware,
  orderController.updateDeliveryStatus
);

// Create a new order
router.post('/', userAuthMiddleware, orderController.createOrder);


// Get user's order history
router.get('/user', userAuthMiddleware, orderController.getUserOrderHistory);


// Cancel an order
router.put('/:orderId/cancel', userAuthMiddleware, orderController.cancelOrder);

// Get order by ID
router.get('/:orderId', userAuthMiddleware, orderController.getOrderById);

router.get('/item/:orderItemId', userAuthMiddleware, orderController.getOrderItemById);

// Delete an order
router.delete('/:orderId', userAuthMiddleware, orderController.deleteOrder);



module.exports = router;

