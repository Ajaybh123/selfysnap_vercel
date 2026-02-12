import { Box, Button, Divider } from '@mui/material';
import { useEffect } from 'react';
import PaymentsIcon from '@mui/icons-material/Payments';
import OrderStepper from './OrderStepper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import {
  cancelOrder,
  fetchOrderById,
  fetchOrderItemById,
} from '../../../Redux Toolkit/Customer/OrderSlice';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { auth, orders } = useAppSelector(store => store);

  // Get orderId and orderItemId from URL params
  const { orderItemId, orderId } = useParams<{ orderItemId: string; orderId: string }>();

  // Fetch order and order item data on mount
  useEffect(() => {
    if (!orderItemId || !orderId) return;

    const jwt = auth.jwt || localStorage.getItem('jwt') || '';

    dispatch(fetchOrderItemById({ orderItemId, jwt }));
    dispatch(fetchOrderById({ orderId, jwt }));
  }, [auth.jwt, orderId, orderItemId, dispatch]);

  // Handle order cancel
  const handleCancelOrder = () => {
    if (!orderId) return;

    const jwt = auth.jwt || localStorage.getItem('jwt') || '';

    dispatch(cancelOrder({ orderId, jwt }));
  };

  if (!orders.orders || !orders.orderItem) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        No order found
      </div>
    );
  }

  const orderItem = orders.orderItem;
  const currentOrder = orders.currentOrder;

  return (
    <Box className="space-y-5">
      {/* Product Info Section */}
      <section className="flex flex-col gap-5 justify-center items-center">
        <img className="w-[100px]" src={orderItem.product.images[0]} alt={orderItem.product.title} />
        <div className="text-sm space-y-1 text-center">
          <h1 className="font-bold">
            {orderItem.product.seller?.businessDetails.businessName}
          </h1>
          <p>{orderItem.product.title}</p>
          <p>
            <strong>Size:</strong> M
          </p>
        </div>
        <div>
          <Button onClick={() => navigate(`/reviews/${orderItem.product._id}/create`)}>
            Write Review
          </Button>
        </div>
      </section>

      {/* Order Status Section */}
      <section className="border p-5">
        <OrderStepper orderStatus={currentOrder?.orderStatus} />
      </section>

      {/* Delivery Address Section */}
      <div className="border p-5">
        <h1 className="font-bold pb-3">Delivery Address</h1>
        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{currentOrder?.shippingAddress.name}</p>
            <Divider flexItem orientation="vertical" />
            <p>{currentOrder?.shippingAddress.mobile}</p>
          </div>
          <p>
            {currentOrder?.shippingAddress.address}, {currentOrder?.shippingAddress.city}, {currentOrder?.shippingAddress.state} - {currentOrder?.shippingAddress.pinCode}
          </p>
        </div>
      </div>

      {/* Payment & Pricing Section */}
      <div className="border space-y-4">
        <div className="flex justify-between text-sm pt-5 px-5">
          <div className="space-y-1">
            <p className="font-bold">Total Item Price</p>
            <p>
              You saved{' '}
              <span className="text-green-500 font-medium text-xs">
                ₹{orderItem.mrpPrice - orderItem.sellingPrice}.00
              </span>{' '}
              on this item
            </p>
          </div>
          <p className="font-medium">₹ {orderItem.sellingPrice}.00</p>
        </div>

        <div className="px-5">
          <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3">
            <PaymentsIcon />
            {currentOrder?.paymentDetails?.status === 'COMPLETED' ? (
              <p className="text-green-600">Paid</p>
            ) : currentOrder?.paymentMethod === 'COD' ? (
              <p>Pay On Delivery</p>
            ) : (
              <Button variant="contained" color="primary" onClick={() => window.location.href = currentOrder?.paymentLinkUrl || '/'}>
                Pay Online
              </Button>
            )}
          </div>
        </div>

        <Divider />

        <div className="px-5 pb-5">
          <p className="text-xs">
            <strong>Sold by: </strong>
            {orderItem.product.seller?.businessDetails.businessName}
          </p>
        </div>

        {/* Cancel Order Button */}
        <div className="p-10">
          <Button
            disabled={currentOrder?.orderStatus === 'CANCELLED'}
            onClick={handleCancelOrder}
            color="error"
            sx={{ py: '0.7rem' }}
            variant="outlined"
            fullWidth
          >
            {currentOrder?.orderStatus === 'CANCELLED' ? 'Order Cancelled' : 'Cancel Order'}
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default OrderDetails;
