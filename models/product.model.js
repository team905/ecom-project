const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});
const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  categoryId: {
    type: String,
    ref: 'Category'
  },
  images: [imageSchema],
  ViewedCount: {
    type: Number,
    default: 0
  }
},
  {
    timestamps: true
  });

const Product = mongoose.model("Product", productSchema);
Product.ensureIndexes()
module.exports = Product;
