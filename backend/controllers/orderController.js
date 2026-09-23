const Order = require("../models/Order");
const Service = require("../models/Service");

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `LAUNDRY-${1000 + count + 1}`;
};

exports.getOrders = async (req, res, next) => {
  try {
    const { search, status, paymentStatus } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) filter.orderNumber = new RegExp(search, "i");

    const orders = await Order.find(filter)
      .populate("customerId")
      .populate("serviceId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId")
      .populate("serviceId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customerId, serviceId, weight } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const pricePerKg = service.price;
    const totalAmount = pricePerKg * weight;
    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerId,
      serviceId,
      weight,
      pricePerKg,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const update = { orderStatus };

    if (orderStatus === "Claimed") update.claimedAt = new Date();
    if (orderStatus === "Ready for Pickup") update.completedAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
};

exports.trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate("customerId")
      .populate("serviceId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};