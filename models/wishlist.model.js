const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
   userId: {
      type: String,
      ref: 'User',
      required: true
   },
   productId: {
      type: String,
      ref: 'Product',
      required: true
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

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

Wishlist.ensureIndexes()
module.exports = Wishlist;
