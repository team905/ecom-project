const mongoose = require("mongoose");

const ViewedProductSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   productName: {
      type: String,
      required: true
   },
   categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
   },
   categoryName: {
      type: String,
      required: true
   }
},
   {
      timestamps: true
   });

const ViewedProduct = mongoose.model("Viewed-Product", ViewedProductSchema);

ViewedProduct.ensureIndexes()
module.exports = ViewedProduct;
