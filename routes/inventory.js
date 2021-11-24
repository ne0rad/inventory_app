var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');

router.get('/', function(req, res, next) {
  res.send('All inventory');
});

router.get('/categories', categoryController.allCategories);

router.get('/items', itemController.allItems);

module.exports = router;
