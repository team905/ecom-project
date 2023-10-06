const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    avtar:{
        type:String
    }
})

const User =new mongoose.model("user",userSchema)

module.exports = User