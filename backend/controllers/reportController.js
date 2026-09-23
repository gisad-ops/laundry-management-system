const Order = require("../models/Order");

// GET /api/reports/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      pendingOrders,
      readyOrders,
      claimedOrders,
      todaySalesResult,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ orderStatus: { $in: ["Received", "Washing", "Drying", "Folding"] } }),
      Order.countDocuments({ orderStatus: "Ready for Pickup" }),
      Order.countDocuments({ orderStatus: "Claimed" }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("customerId", "name")
    ]);

    res.json({
      todayOrders,
      pendingOrders,
      readyOrders,
      claimedOrders,
      todaySales: todaySalesResult[0]?.total || 0,
      recentOrders
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/sales?range=daily|weekly|monthly
exports.getSalesReport = async (req, res, next) => {
  try {
    const { range = "daily" } = req.query;
    let startDate = new Date();
    let groupFormat = "%Y-%m-%d"; // Default daily

    if (range === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
      groupFormat = "%Y-%U"; // Year-Week
    } else if (range === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
      groupFormat = "%Y-%m"; // Year-Month
    } else {
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
    }

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: "PAID" } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/services
exports.getMostUsedServices = async (req, res, next) => {
  try {
    const services = await Order.aggregate([
      {
        $group: {
          _id: "$serviceId",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "serviceDetails"
        }
      },
      { $unwind: "$serviceDetails" },
      {
        $project: {
          serviceName: "$serviceDetails.serviceName",
          count: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.json(services);
  } catch (err) {
    next(err);
  }
};