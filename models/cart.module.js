const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
   userId: {
      type: String,
      ref: 'User',
      required: true
   },
   productId: {
      type: String,
      ref: 'Product',
      required: true,
   },
   productName: {
      type: String
   },
   categoryId: {
      type: String,
      ref: 'Category',
      required: true
   },
   categoryName: {
      type: String
   }
},
   {
      timestamps: true
   });

const cart = mongoose.model('cart', cartSchema);
cart.ensureIndexes()
module.exports = cart;
