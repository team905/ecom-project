const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const authenticateJWT = require('../middleware/auth.middleware');
// router.use('/', authenticateJWT);

router.post('/',authenticateJWT, categoryController.createCategory);
router.post('/all', categoryController.getAllCategories);
router.post('/getone', categoryController.getCategoryById);
router.post('/update',authenticateJWT, categoryController.updateCategoryById);
router.post('/delete', authenticateJWT,categoryController.deleteCategoryById);

module.exports = router;
