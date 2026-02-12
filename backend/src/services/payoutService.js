const Payout = require("../models/Payout");
const Transaction = require("../models/Transaction");

class PayoutService {

  // 👉 Payout history (Tab 2)
  async getAllPayouts() {
    return await Payout.find()
      .populate("seller")
      .populate("transactions");
  }

  // 👉 Summary for Tab 1 (Transaction se data fetch)
  async getTransactionSummary() {

    const now = new Date();

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date();
    startOfMonth.setMonth(now.getMonth() - 1);

    // ✅ Seller Wise Orders
    const sellerSummary = await Transaction.aggregate([
      {
        $group: {
          _id: "$seller",
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "sellers",
          localField: "_id",
          foreignField: "_id",
          as: "seller"
        }
      },
      {
        $unwind: "$seller"
      }
    ]);

    console.log("Seller Summary: ", sellerSummary);

    // ✅ Weekly Orders
    const weekly = await Transaction.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // ✅ Monthly Orders
    const monthly = await Transaction.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    return {
      sellerSummary,
      weekly,
      monthly
    };
  }

  // 👉 Create payout
  async createPayout(data) {
    const payout = new Payout(data);
    return await payout.save();
  }

  // 👉 Update payout status
  async updateStatus(id, status) {
    return await Payout.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("seller")
      .populate("transactions");
  }

}

module.exports = new PayoutService();
