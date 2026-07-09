const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Product image URL is required"],
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Product", productSchema);