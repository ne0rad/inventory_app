var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');

router.get('/categories', categoryController.all_categories);
router.get('/category/:id', categoryController.category_details);
router.get('/newCategory', categoryController.new_category_get);
router.post('/newCategory', categoryController.new_category_post);

router.get('/items', itemController.all_items);

router.get('/newItem', itemController.new_item_get);
router.post('/newItem', itemController.new_item_post);

router.get('/item/:id', itemController.item_details);

module.exports = router;
