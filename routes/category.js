const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const authenticateJWT = require('../middleware/auth.middleware');
// router.use('/', authenticateJWT);

router.post('/', categoryController.createCategory);
router.post('/all', categoryController.getAllCategories);
router.post('/getone', categoryController.getCategoryById);
router.post('/update', categoryController.updateCategoryById);
router.post('/delete', categoryController.deleteCategoryById);

module.exports = router;
