var express = require('express');
var router = express.Router();
const wistListController = require("../controllers/wistlist.controller")
const authenticateJWT = require('../middleware/auth.middleware');

// router.use('/', authenticateJWT);
router.post("/add",wistListController.AddToWistList)

module.exports = router;
