var express = require('express');
var router = express.Router();
const cardController = require("../controllers/card.controller")
const authenticateJWT = require('../middleware/auth.middleware');

// router.use('/', authenticateJWT);
/* GET users listing. */
router.post("/add",cardController.AddToCardList)

module.exports = router;
