const OrderStatus = Object.freeze({
    PENDING: "PENDING",
    PLACED: "PLACED",
    CONFIRMED: "CONFIRMED",
    ASSIGNED: "ASSIGNED",   // 👈 ADD THIS
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
});
module.exports = OrderStatus;