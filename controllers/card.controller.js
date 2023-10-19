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

const cardCount =  async (req, res) => {
   try {
     const { productId, categoryId } = req.body;
 
     if (!productId || !categoryId) {
       return res.status(400).json({ message: 'Missing required parameters' });
     }
 
     const count = await Card.countDocuments({
       productId,
       categoryId,
     });
 
     res.json({ count });
   } catch (error) {
     res.status(500).json({ message: 'Internal server error', error: error.message });
   }
 }

module.exports =
   { AddToCardList,cardCount }