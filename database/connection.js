const mongoose =  require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect("mongodb+srv://techteam905:techteam905@clustere1.7uzj7zi.mongodb.net/").then(()=>{
    console.log("Connected to database")
}).catch((err)=>{
    console.log(err)
})
