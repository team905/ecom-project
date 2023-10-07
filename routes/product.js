const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateJWT = require('../middleware/auth.middleware');

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;
