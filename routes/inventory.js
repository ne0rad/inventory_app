var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');

router.get('/categories', categoryController.allCategories);

router.get('/items', itemController.allItems);
router.get('/newItem', itemController.newItemGet);
router.post('/newItem', itemController.newItemPost);

module.exports = router;
