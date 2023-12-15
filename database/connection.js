const mongoose =  require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect("mongodb://127.0.0.1:27017/crud-template").then(()=>{
    console.log("Connected to database")
}).catch((err)=>{
    console.log(err)
})


// mongodb+srv://techteam905:techteam905@clustere1.7uzj7zi.mongodb.net/