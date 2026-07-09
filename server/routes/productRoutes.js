const mongoose = require('mongoose');
const Product = require('../models/Product');
const express = require("express");

const router = express.Router();
const { getAllProducts, addProduct, deleteProduct } = require("../controllers/productController");


router.route("/")
  .get(getAllProducts)   
  .post(addProduct);     


router.get("/:id", async (req, res) => { 
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`⚠️ Invalid ID format received: ${id}`);
      return res.status(404).json({ message: "Product not found (Invalid ID format)" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);

  } catch (err) {
    console.error("🔥 Server Error inside Single Product API:", err.message);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;