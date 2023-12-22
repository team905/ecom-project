var express = require('express');
var router = express.Router();
const cartController = require("../controllers/cart.controller");
const authenticateJWT = require('../middleware/auth.middleware');

// router.use('/', authenticateJWT);
/* GET users listing. */
router.post("/add",cartController.AddTocartList);
router.post('/cartCount',cartController.cartCount );


module.exports = router;
