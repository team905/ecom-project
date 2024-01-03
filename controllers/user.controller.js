const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const { param } = require('../routes/product');
const { haversineDistance } = require('../utils/googleMaps');
const { v4: uuid } = require("uuid");
const axios = require('axios');
const apiKey = 'AIzaSyClfJOPHWpoqrhI96olnurwlG4yFUq-tnI';

const createUser = async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      return res.status(409).send({ message: "User already exists" });
    }
    let newUuid = uuid();
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      _id: newUuid,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avtar: req.body.avtar,
      role: req.body.role,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      categoryAccess: req.body.categoryAccess,
      password: hashedPassword,
    })
    const user = await userData.save()
    res.send({ message: "User created", Data: user.email })
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.body.search || '';
    
    const searchCondition = {
      $or: [
        { name: new RegExp(searchQuery, 'i') }, // case-insensitive regex search
        { email: new RegExp(searchQuery, 'i') }
      ]
    };
    const totalUsers = await User.countDocuments(searchCondition);

    const userData = await User.find(searchCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ 
        path: 'categoryAccess', 
        model: 'Category', // Replace 'Category' with the name of your category model
        select: '_id name' // Select only the id and name of the category
      });

    res.send({
      message: "Success",
      total: totalUsers,
      data: userData,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (e) {
    res.send(e);
  }
};

const getOneUser = async (req, res) => {
  try {
    const _id = req.body.id
    const oneUser = await User.findOne({ _id });
    if (oneUser) {
      res.send(oneUser)
    } else {
      res.send("User not found");
    }
  } catch (e) {
    res.send(e);
  }
}

const getNearbyShopsByCategory = async (req, res) => {
  try {
    const { categoryId, referenceLatitude, referenceLongitude } = req.body;

    var nearByShops = await User.find({
      $and: [
        { categoryAccess: { $in: [categoryId] } },
        { role: "SHOP" }
      ]
    });

    // Calculate approximate distance for each shop
    var sortedShops = nearByShops.map(coord => {
      const plainCoord = coord.toObject();
      const distance = haversineDistance(referenceLatitude, referenceLongitude, plainCoord.latitude, plainCoord.longitude);
      return { ...plainCoord, distance };
    });

    // Sort by distance
    sortedShops.sort((a, b) => a.distance - b.distance);

    // Fetch accurate distance data for the first four sorted shops
    for (let i = 0; i < sortedShops.length; i++) {
      if (i < 4) {
        var origins = [`${referenceLatitude}, ${referenceLongitude}`];
        var destinations = [`${sortedShops[i].latitude}, ${sortedShops[i].longitude}`];
        var url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins.join('|')}&destinations=${destinations.join('|')}&key=${apiKey}`;

        try {
          var response = await axios.get(url);
          var data = response.data;
          console.log(data);
          sortedShops[i].distance = {
            distance: data.rows[0].elements[0].distance.text,
            duration: data.rows[0].elements[0].duration.text
          };
        } catch (error) {
          console.error('Error fetching distance info:', error);
          sortedShops[i].distance = {};
        }
      } else {
        sortedShops[i].distance = {};
      }
      sortedShops[i].searchedCategory = categoryId;
    }
    // Send the sorted and processed list
    if (sortedShops.length > 0) {
      res.send(sortedShops);
    } else {
      res.send("Shops not found");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.body.id
    const deleteUser = await User.deleteOne({ _id });
    if (deleteUser.deletedCount == 0) {
      return res.status(404).json({ message: 'User not found' });
    } 
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

const updateUser = async (req, res) => {
  try {
    const _id = req.body.id
    const userCheck = await User.find({ _id });
    if (!userCheck) {
      return res.send({ message: "User Not Found" });
    }
    const updateUser = await User.updateOne({ _id }, req.body);
    if (updateUser.modifiedCount == 0) {
      return res.send({ message: "User Not updated" });
    }
    const userupdateData = await User.findOne({ _id });
    res.send({ message: "User Data Updated", Data: userupdateData });
  } catch (e) {
    res.send(e);
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getOneUser,
  getUsers,
  getNearbyShopsByCategory
};