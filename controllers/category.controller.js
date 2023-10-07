const Category = require('../models/category.model');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json({ message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: 'Categories retrieved successfully', data: categories });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category retrieved successfully', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a category by ID
const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const updatedCategoryData = req.body;
  try {
    const category = await Category.findByIdAndUpdate(id, updatedCategoryData, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a category by ID
const deleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
