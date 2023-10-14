const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  includedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Referencing the Product model
  }]
},
  {
    timestamps: true
  });

const Category = mongoose.model("Category", categorySchema);

Category.ensureIndexes()
module.exports = Category;
