const mongoose =  require('mongoose');


mongoose.connect("mongodb://localhost:27017/crud-template").then(()=>{
   console.log("Connected to database")
}).catch(()=>{
   console.log("Connection Unsuccessfull")
})