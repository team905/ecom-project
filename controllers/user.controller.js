const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const { param } = require('../routes/product');
const { v4: uuid } = require("uuid");

const createUser = async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email});
    if(checkUser){
    return res.status(409).send({ message: "User already exists"});
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
      categoryAccess: req.body.categoryAccess,
      password: hashedPassword,
    })
    const user = await userData.save()
    res.send({ message: "User created", Data: user.email })
  } catch (err) {
    res.send(err);
  }
}
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
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
const deleteUser = async (req, res) => {
  try {
    const _id = req.body.id
    const deleteUser = await User.deleteOne({ _id });
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

     return res.send( {message : "User Not Found"} )
    }
    const updateUser = await User.updateOne({ _id }, req.body);
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
  getUsers
};