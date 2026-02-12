const payoutService = require("../services/payoutService");

// ✅ Tab 2 → Payout History
exports.getAllPayouts = async (req, res) => {
  try {
    const payouts = await payoutService.getAllPayouts();

    res.status(200).json({
      success: true,
      payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
      error: error.message,
    });
  }
};


// ✅ Tab 1 → Transaction Summary (Seller Wise + Weekly + Monthly)
exports.getPayoutSummary = async (req, res) => {
  try {
    const summary =
      await payoutService.getTransactionSummary();

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch summary",
      error: error.message,
    });
  }
};


// ✅ Create Payout (Manual Admin Payout)
exports.createPayout = async (req, res) => {
  try {
    const {
      sellerId,
      amount,
      commission = 0,
      transactions = [],
    } = req.body;

    if (!sellerId || !amount) {
      return res.status(400).json({
        success: false,
        message: "sellerId and amount required",
      });
    }

    const payout = await payoutService.createPayout({
      seller: sellerId,
      amount,
      commission,
      transactions,
    });

    res.status(201).json({
      success: true,
      payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payout",
      error: error.message,
    });
  }
};


// ✅ Update Payout Status
exports.updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status required",
      });
    }

    const payout =
      await payoutService.updateStatus(
        id,
        status
      );

    res.status(200).json({
      success: true,
      payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payout",
      error: error.message,
    });
  }
};
