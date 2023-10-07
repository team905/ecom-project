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
});

const Category = mongoose.model("Category", categorySchema);

Category.ensureIndexes()
  .then(() => {
    console.log('Indexes Category are in sync');
  })
  .catch((err) => {
    console.error('Error  Category syncing indexes:', err);
  });
module.exports = Category;
