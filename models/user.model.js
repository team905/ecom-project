const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  deletedAt: {
    type: Date
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
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
  .then(() => {
    console.log('Indexes are in sync');
  })
  .catch((err) => {
    console.error('Error syncing indexes:', err);
  });
module.exports = User