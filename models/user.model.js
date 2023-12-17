const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true
  },
  avtar: {
    type: String
  },
  categoryAccess: {
    type: [String]
  },
  deletedAt: {
    type: Date
  },
  role: {
    type: String,
    required: true,
    enum: ['USER', 'ADMIN','SHOP']
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
},
  {
    timestamps: true
  });

const User = new mongoose.model("user", userSchema)

User.ensureIndexes()
module.exports = User