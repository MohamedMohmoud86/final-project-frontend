const express = require("express");
const router = express.Router();

const { getAllOrders, updateOrderStatus, createNewOrder, getAdminAllOrders } = require("../controllers/orderController");
const { body, validationResult } = require("express-validator"); 

const validateOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};


router.route("/admin/all")
  .get(getAdminAllOrders);


router.route("/")
  .get(getAllOrders)
  .post(
    [
      body("items").isArray({ min: 1 }).withMessage("Your cart cannot be empty"),
      body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a valid number and at least 1"),
      body("shippingAddress").trim().notEmpty().withMessage("Shipping address is required"),
      body("phone").trim().notEmpty().withMessage("Phone number is required")
    ],
    validateOrder, 
    createNewOrder 
  );


router.route("/:id/status")
  .put(
    [
      body("status").isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]).withMessage("Invalid order status")
    ],
    validateOrder,
    updateOrderStatus
  );

module.exports = router;