const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getOrders, getOrder, createOrder, updateOrder, deleteOrder, updateStatus, trackOrder,
} = require("../controllers/orderController");

// public tracking
router.get("/track/:orderNumber", trackOrder);

router.use(protect);
router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);
router.put("/:id/status", updateStatus);

module.exports = router;