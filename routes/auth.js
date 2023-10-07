var express = require('express');
var router = express.Router();
const {login,logout,forgetPass,resetPassword} = require("../controllers/auth.controller")
const authenticateJWT = require('../middleware/auth.middleware');
/* GET users listing. */
router.post("/login",login)
router.post('/forgetPassword',forgetPass);
router.post('/reset-password',resetPassword);
router.post('/logout', authenticateJWT,logout);

module.exports = router;
