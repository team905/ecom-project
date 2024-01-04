const Category = require('../models/category.model');
const { v4: uuid } = require("uuid");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const checkCategory = await Category.findOne({ name: req.body.name});
    if(checkCategory){
    return res.status(409).send({ message: "Category already exists"});
    }
    let newUuid = uuid();
    const categoryData = req.body;
    categoryData._id = newUuid;
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json({ message: 'Category created successfully', data: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.body.search || '';
    
    const searchCondition = { name: new RegExp(searchQuery, 'i') };
    
    const totalCategory = await Category.countDocuments(searchCondition);
    const categoryData = await Category.find(searchCondition)
    .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.send({
      message: "Success",
      total: totalCategory,
      data: categoryData,
      currentPage: page,
      totalPages: Math.ceil(totalCategory / limit),
    });
  } catch (e) {
    res.send(e);
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  const _id  = req.body.id;
  try {
    const category = await Category.findOne({_id});
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
  const _id = req.body.id;
  const updatedCategoryData = req.body;
  try {
    const category = await Category.updateOne({ _id }, updatedCategoryData);
    if (category.modifiedCount == 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const categoryUpdatedData = await Category.findOne({ _id });
    res.status(200).json({ message: 'Category updated successfully', data: categoryUpdatedData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a category by ID
const deleteCategoryById = async (req, res) => {
  const  _id  = req.body.id;
  try {
    const category = await Category.deleteOne({_id});
    if (category.deletedCount == 0) {
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
