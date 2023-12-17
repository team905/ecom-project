const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Wishlist = require("../models/wishlist.model")
const ViewedProduct = require("../models/viewed-product.model")
const Cart = require("../models/cart.module")
const jwt = require("jsonwebtoken")

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
    res.status(500).json({ message: 'Internal server error',error});
  }
};


// Get all products
const getAllProducts = async (req, res) => {
  try {
    // TODO
    // pass caterogy id 
    const products = await Product.find();
    res.status(200).json({ message: 'Products retrieved successfully', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.ViewedCount += 1;
    await product.save();
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'accessKey');
      const userId = decoded.userId;
      const category = await Category.findById(product.categoryId)
      const viewedProduct = new ViewedProduct({
        userId,
        productId: product._id,
        productName: product.name,
        categoryId: product.categoryId,
        categoryName: category.name
      });

      await viewedProduct.save();
    }

    res.status(200).json({ message: 'Product retrieved successfully', data: product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Update a product by ID
const updateProductById = async (req, res) => {
  const  _id  = req.body.id;
  const updatedProductData = req.body;
  try {
    const product = await Product.findByIdAndUpdate(_id, updatedProductData, { new: true });
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
  const  _id  = req.body.id;
  try {
    const product = await Product.findByIdAndDelete({_id});
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const getProductFilter = async (req, res) => {
  try {
    const { categoryId, type, sortBy, minPrice, maxPrice, sortOrder, userId } = req.query;

    const userWishlist = await Wishlist.find({ userId }, 'productId');
    const wishlistProductIds = userWishlist.map((wishlistItem) => wishlistItem.productId);
    const userCart = await Cart.find({ userId }, 'productId');
    const cartProductIds = userCart.map((cartItem) => cartItem.productId);
    const filter = {};
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (type) {
      filter.type = type;
    }
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    const sortCriteria = sortBy === 'date' ? { createdAt: sortOrder === 'asc' ? 1 : -1 } : { price: sortOrder === 'asc' ? 1 : -1 };

    const products = await Product.find(filter).sort(sortCriteria);

    const groupedProducts = groupProductsByType(products, wishlistProductIds, cartProductIds);

    res.json(groupedProducts);
  } catch (error) {
    res.send(error.message);
  }
};

function groupProductsByType(products, wishlistProductIds, cartProductIds) {
  const groupedProducts = {};

  for (const product of products) {
    if (!groupedProducts[product.type]) {
      groupedProducts[product.type] = [];
    }

    const isWishlist = wishlistProductIds.some(
      (wishlistProductId) => wishlistProductId.toString() === product._id.toString()
    );

    const isCart = cartProductIds.some(
      (cartProductId) => cartProductId.toString() === product._id.toString()
    );

    const cleanProduct = {
      _id: product._id,
      name: product.name,
      type: product.type,
      price: product.price,
      categoryId: product.categoryId,
      __v: product.__v,
      wishlist: isWishlist,
      cart: isCart,
    };

    groupedProducts[product.type].push(cleanProduct);
  }

  return groupedProducts;
}

const AddImage = async (req, res) => {
  try {
    const { productId, imagePath } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const newImage = {
      url: imagePath,
      status: 'active',
    };

    product.images.push(newImage);
    await product.save();

    res.status(201).json({ message: 'Product image added successfully', data: newImage });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}





module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductFilter,
  AddImage,
};