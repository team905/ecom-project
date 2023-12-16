const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const { param } = require('../routes/product');
const createUser = async (req, res) => {
  try {
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avtar: req.body.avtar,
      password: hashedPassword,
    })
    const user = await userData.save()
    res.send({ message: "Success", Data: user })
  } catch (err) {
    res.send(err);
  }
}
const getUser = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 1;
    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments();
    const userData = await User.find()
      .skip(skip)
      .limit(limit);

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
}
const getOneUser = async (req, res) => {
  try {
    const _id = req.body.id
    const oneUser = await User.find({ _id });
    if (oneUser) {
      res.send(oneUser)
    } else {
      res.send("User not register");
    }
  } catch (e) {
    res.send(e);
  }
}
const deleteUser = async (req, res) => {
  try {
    const _id = req.body.id
    const deleteUser = await User.findByIdAndDelete({ _id });
    if (deleteUser) {
      res.send("User Deleted")
    } else {
      res.send("User not found");
    }
  } catch (e) {
    res.send(e);
  }
}
const updateUser = async (req, res) => {
  try {
    const _id = req.body.id
    const userCheck = await User.find({ _id });
    if (!userCheck) {

      res.send( {message : "User Not Found"} )
    }
    const updateUser = await User.findByIdAndUpdate(_id, req.body);
    const userupdateData = await User.find({ _id });
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
  getUser
};