const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { recordPayment, getPayments } = require("../controllers/paymentController");

router.use(protect);
router.route("/").get(getPayments).post(recordPayment);

module.exports = router;