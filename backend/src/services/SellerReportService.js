const OrderStatus = require("../domain/OrderStatus");
const SellerReport = require("../models/SelllerReposrt");
const OrderService = require("./OrderService");

class SellerReportService {
  async getSellerReport(seller) {
    try {
      let sellerReport = await SellerReport.findOne({ seller: seller._id });
      const orders = await OrderService.getShopsOrders(seller._id);

      const totalEarnings = orders.reduce(
        (total, order) => total + (order.totalSellingPrice || 0),
        0
      );
      const totalCommission = orders.reduce(
        (total, order) => total + (order.commission || 0),
        0
      );
      const canceledOrders = orders.filter(
        (order) => order.orderStatus == OrderStatus.CANCELLED
      );
      const totalRefunds = canceledOrders.reduce(
        (total, order) => total + (order.totalSellingPrice || 0),
        0
      );
      const netEarnings = totalEarnings - totalCommission;

      // Calculate payout (pending payout = net earnings - paid out)
      // For simplicity, assume all net earnings are pending payout
      // In a real system, track payouts in a separate collection

      if (!sellerReport) {
        sellerReport = new SellerReport({
          seller: seller._id,
        });
      }

      sellerReport.totalOrders = orders.length;
      sellerReport.totalEarnings = totalEarnings;
      sellerReport.totalSales = orders.length;
      sellerReport.canceledOrders = canceledOrders.length;
      sellerReport.totalRefunds = totalRefunds;
      sellerReport.netEarnings = netEarnings;
      sellerReport.totalCommission = totalCommission;
      sellerReport.pendingPayout = netEarnings; // For now, all net earnings are pending

      sellerReport = await sellerReport.save();
      return sellerReport;
    } catch (err) {
      throw new Error(`Error fetching seller report: ${err.message}`);
    }
  }

  async updateSellerReport(sellerReport) {
    try {
      // Update and save the seller report
      return await SellerReport.findByIdAndUpdate(
        sellerReport._id,
        sellerReport,
        { new: true }
      );
    } catch (err) {
      throw new Error(`Error updating seller report: ${err.message}`);
    }
  }
}

module.exports = new SellerReportService();
