const Product = require("../models/Product");


exports.getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { title, price, description, category, thumbnail } = req.body;

   
    if (!title || !price || !description || !category || !thumbnail) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const newProduct = await Product.create({
      title,
      price,
      description,
      category,
      thumbnail
    });

    res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};