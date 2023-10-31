const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const authenticateJWT = require('../middleware/auth.middleware');
// router.use('/', authenticateJWT);

router.post('/',authenticateJWT, categoryController.createCategory);
router.post('/all', categoryController.getAllCategories);
router.post('/:id', categoryController.getCategoryById);
router.put('/:id',authenticateJWT, categoryController.updateCategoryById);
router.delete('/:id', authenticateJWT,categoryController.deleteCategoryById);

module.exports = router;
