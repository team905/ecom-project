const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Create a new product
const createProduct = async (req, res) => {
   try {
     const productData = req.body;
     const categoryId = productData.categoryId; 
 
     const category = await Category.findById(categoryId);
 
     if (!category) {
       return res.status(404).json({ message: 'Category not found' });
     }
     const product = new Product({
       name: productData.name,
       type: productData.type,
       price: productData.price,
       categoryId: category._id
     });
     await product.save();
     category.includedItems.push(product._id);
     await category.save();
 
     res.status(201).json({ message: 'Product created successfully', data: product });
   } catch (error) {
     res.status(500).json({ message: 'Internal server error', error });
   }
 };
 

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: 'Products retrieved successfully', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product retrieved successfully', data: product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a product by ID
const updateProductById = async (req, res) => {
  const { id } = req.params;
  const updatedProductData = req.body;
  try {
    const product = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
