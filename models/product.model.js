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
    }
});

const Product = mongoose.model("Product", productSchema);
Product.ensureIndexes()
  .then(() => {
    console.log('Indexes Product are in sync');
  })
  .catch((err) => {
    console.error('Error Product syncing indexes:', err);
  });

module.exports = Product;
