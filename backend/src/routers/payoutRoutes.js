const express = require("express");
const router = express.Router();

const payoutController = require("../controllers/payoutController");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");


// ✅ TAB 2 → Payout History (Admin Table)
router.get(
  "/admin",
  adminAuthMiddleware,
  payoutController.getAllPayouts
);


// ✅ TAB 1 → Seller Summary (Transaction Based)
router.get(
  "/summary",
  adminAuthMiddleware,
  payoutController.getPayoutSummary
);


// ✅ Manual Create Payout (ADMIN ONLY)
router.post(
  "/create",
  adminAuthMiddleware,
  payoutController.createPayout
);


// ✅ Update Status (Pending → Success → Rejected)
router.put(
  "/:id/status",
  adminAuthMiddleware,
  payoutController.updatePayoutStatus
);

module.exports = router;
