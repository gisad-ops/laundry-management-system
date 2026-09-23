const Payment = require("../models/Payment");
const Order = require("../models/Order");

exports.recordPayment = async (req, res, next) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const payment = await Payment.create({
      orderId,
      amount,
      paymentMethod,
      paymentStatus: amount >= order.totalAmount ? "PAID" : "PARTIALLY PAID",
    });

    order.paymentStatus = amount >= order.totalAmount ? "PAID" : "PARTIALLY PAID";
    await order.save();

    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate("orderId").sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    next(err);
  }
};