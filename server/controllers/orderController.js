const Order = require("../models/Order");
const Product = require("../models/Product"); 

const mongoose = require("mongoose");

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.query.userId; 

    console.log("=== Incoming Request ===");
    console.log("User ID received from frontend:", userId);

    if (!userId || userId === "undefined" || userId === "null") {
      return res.status(200).json([]); 
    }

  
    let queryConditions = [
      { userId: String(userId) },
      { user: String(userId) }
    ];

    if (mongoose.Types.ObjectId.isValid(userId)) {
      const oId = new mongoose.Types.ObjectId(userId);
      queryConditions.push({ userId: oId });
      queryConditions.push({ user: oId });
    }

    
    const orders = await Order.find({
      $or: queryConditions
    }).sort({ createdAt: -1 }); 

    console.log(" Strictly found for this user:", orders.length);
    console.log("========================");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getAdminAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 }); 
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
  
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createNewOrder = async (req, res) => {
  try {
    const { items, shippingAddress, phoneNumber } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

  
    let calculatedTotalPrice = 0;

    for (let item of items) {
    
      const dbProduct = await Product.findById(item.product);
      
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product not found!` });
      }

     
      calculatedTotalPrice += dbProduct.price * item.quantity;
    }

 
    const newOrder = await Order.create({
      user: req.body.userId || req.user?._id,
      items,
      totalPrice: calculatedTotalPrice, 
      shippingAddress,
      phoneNumber,
      paymentStatus: "Pending", 
      orderStatus: "Processing" 
    });

    res.status(201).json({ success: true, message: "Order placed successfully! 🛒", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};