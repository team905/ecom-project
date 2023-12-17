const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  noOfProducts: {
    type: Number,
    required: true,
    default: 0
  },
  includedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
},
  {
    timestamps: true
  });

const Category = mongoose.model("Category", categorySchema);

Category.ensureIndexes()
module.exports = Category;
