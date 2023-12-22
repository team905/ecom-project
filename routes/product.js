const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateJWT = require('../middleware/auth.middleware');

// router.use('/', authenticateJWT);
router.post('/add', productController.createProduct);
router.post('/getByCategory', productController.getAllProductsByCategory);
router.post('/getProduct', productController.getProductById);
router.post('/update', productController.updateProductById);
router.post('/delete', productController.deleteProductById);
router.post('/products', productController.getProductFilter )
router.post('/addImage', productController.AddImage )

module.exports = router;