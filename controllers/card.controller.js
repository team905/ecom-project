const Card = require("../models/card.module")


const AddToCardList = async (req, res) => {
   const { categoryName, categoryId, productName, productId, userId } = req.body;

   try {
      const newCard = new Card({
         categoryName,
         categoryId,
         productName,
         productId,
         userId
      });

      const createdCard = await newCard.save();

      res.status(201).json({ message: 'Card created', createdCard: createdCard });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
   }
};

module.exports =
   { AddToCardList }