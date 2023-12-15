const Wishlist = require("../models/wishlist.model")


const AddToWistList = async (req, res) => {
  const { categoryName, categoryId, productName, productId, userId } = req.body;

  try {
    const newWishlist = new Wishlist({
      categoryName,
      categoryId,
      productName,
      productId,
      userId
    });

    const createdWishlist = await newWishlist.save();

    res.status(201).json({ message: 'Wishlist created', wishlist: createdWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const wistlistCount = async (req, res) => {
  try {
    const { productId, categoryId } = req.body;

    if (!productId || !categoryId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const count = await Wishlist.countDocuments({
      productId,
      categoryId,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports =
  { AddToWistList, wistlistCount }