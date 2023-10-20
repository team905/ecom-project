const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category' // Referencing the Category model
  },
  ViewedCount: {
    type: Number,
    default: 0 // Default value is 0
  }
},
  {
    timestamps: true
  });

const Product = mongoose.model("Product", productSchema);
Product.ensureIndexes()
module.exports = Product;
