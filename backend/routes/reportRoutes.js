const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getDashboardStats, getSalesReport, getMostUsedServices } = require("../controllers/reportController");

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/sales", getSalesReport);
router.get("/services", getMostUsedServices);

module.exports = router;