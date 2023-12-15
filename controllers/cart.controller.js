const cart = require("../models/cart.module")


const AddTocartList = async (req, res) => {
   const { categoryName, categoryId, productName, productId, userId } = req.body;

   try {
      const newcart = new cart({
         categoryName,
         categoryId,
         productName,
         productId,
         userId
      });

      const createdcart = await newcart.save();

      res.status(201).json({ message: 'cart created', createdcart: createdcart });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
   }
};

const cartCount = async (req, res) => {
   try {
      const { productId, categoryId } = req.body;

      if (!productId || !categoryId) {
         return res.status(400).json({ message: 'Missing required parameters' });
      }

      const count = await cart.countDocuments({
         productId,
         categoryId,
      });

      res.json({ count });
   } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
   }
}

module.exports =
   { AddTocartList, cartCount }