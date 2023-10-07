var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller")
const authenticateJWT = require('../middleware/auth.middleware');

router.use('/', authenticateJWT);
/* GET users listing. */
router.post("/",userController.createUser)
router.get("/",userController.getUser)
router.get("/:id",userController.getOneUser)
router.delete("/:id",userController.deleteUser)
router.patch("/:id",userController.updateUser)

module.exports = router;
