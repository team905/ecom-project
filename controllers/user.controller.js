const User = require("../models/user.model")
module.exports={
   createUser:async(req,res)=>{
      try{
         const userData = new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            avtar:req.body.avtar
      })
      const user = await userData.save()
      res.send({massage:"Success",Data:user})
      }catch(err){
         res.send(err);
      }
   },
   getUser :async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1; 
        const take = parseInt(req.query.take) ||1;
        const skip = (page - 1) * take;
        const totalUsers = await User.countDocuments(); 
        const userData = await User.find()
          .skip(skip)
          .limit(take);
    
        res.send({
          message: "Success",
          data: userData,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / take),
        });
      } catch (e) {
        res.send(e);
      }
    },
    
  getOneUser:async(req,res)=>{
      try{
              const _id = req.params.id
              const oneUser = await User.find({_id})
              if(oneUser){
              res.send(oneUser)
              }else{
                  res.send("User not register");
              }
      }catch(e){
          res.send(e)
      }
  },
  deleteUser:async(req,res)=>{
      try{
          const _id = req.params.id
          const deleteUser = await User.findByIdAndDelete({_id})
          res.send("User Deleted")
      }catch(e){
          res.send(e)
      }
  },
  updateUser:async(req,res)=>{
      try{
          const _id = req.params.id
          const updateUser = await User.findByIdAndUpdate(_id,req.body)
          res.send({massage:"User Data Updated",Data:updateUser})
      }catch(e){

      }
  }
}