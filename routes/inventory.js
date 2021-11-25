var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');

router.get('/categories', categoryController.allCategories);

router.get('/items', itemController.all_items);
router.get('/newItem', itemController.new_item_get);
router.post('/newItem', itemController.new_item_post);

module.exports = router;
