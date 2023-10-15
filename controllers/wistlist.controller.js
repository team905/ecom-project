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

module.exports =
  { AddToWistList }