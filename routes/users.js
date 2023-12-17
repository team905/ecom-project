var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller")
const authenticateJWT = require('../middleware/auth.middleware');

// router.use('/', authenticateJWT);
/* GET users listing. */
router.post("/",userController.createUser);
router.post("/all",userController.getUsers);
router.post("/getOneUser",userController.getOneUser);
router.post("/deleteUser",userController.deleteUser);
router.post("/updateUser",userController.updateUser);

module.exports = router;
