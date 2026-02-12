import { type Product } from './productTypes';
import { type Address, type User } from './userTypes';

export interface OrderState {
    orders: Order[];
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any | null;
    loading: boolean;
    error: string | null;
    orderCanceled: boolean;
}

// Extend Order with payment info
export interface Order {
    _id: string;
    orderId: string;
    user: User;
    sellerId: number;
    orderItems: OrderItem[];
    orderDate: string;
    shippingAddress: Address;
    paymentDetails: {
        status: 'PENDING' | 'COMPLETED';
        // any other payment info from backend
    } | null;
    paymentMethod?: 'COD' | 'ONLINE';      // <-- added
    paymentLinkUrl?: string;               // <-- added
    totalMrpPrice: number;
    totalSellingPrice?: number;           // Optional field
    discount?: number;                     // Optional field
    orderStatus: OrderStatus;
    totalItem: number;
    deliverDate: string;
    commission?: number;                  // Commission for this order
    netEarnings?: number;                 // Net earnings for this order (totalSellingPrice - commission)
}

export type OrderStatus =
    | "PENDING"
    | "PLACED"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    _id: number;
    order: Order;
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: number;
}
