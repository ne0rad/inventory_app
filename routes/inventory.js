var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');
var stockController = require('../controllers/stockController');

router.get('/categories', categoryController.all_categories);
router.get('/category/:id', categoryController.category_details);
router.get('/newCategory', categoryController.new_category_get);
router.post('/newCategory', categoryController.new_category_post);
router.get('/deleteCategory/:id', categoryController.delete_category_get);
router.post('/deleteCategory/:id', categoryController.delete_category_post);

router.get('/items', itemController.all_items);
router.get('/newItem', itemController.new_item_get);
router.post('/newItem', itemController.new_item_post);
router.get('/item/:id', itemController.item_details);
router.get('/deleteItem/:id', itemController.delete_item_get);
router.post('/deleteItem/:id', itemController.delete_item_post);
router.get('/updateItem/:id', itemController.update_item_get);
router.post('/updateItem/:id', itemController.update_item_post);

router.get('/stock/:id', stockController.stock_details);
router.get('/stock', stockController.all_stock);
router.get('/newStock', stockController.new_stock_get);
router.post('/newStock', stockController.new_stock_post);
router.get('/deleteStock/:id', stockController.delete_stock_get);
router.post('/deleteStock/:id', stockController.delete_stock_post);
router.get('/updateStock/:id', stockController.update_stock_get);
router.post('/updateStock/:id', stockController.update_stock_post);

module.exports = router;
