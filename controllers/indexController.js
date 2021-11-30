var async = require('async');
var Item = require('../models/item');
var Category = require('../models/category');
var Stock = require('../models/stock');

exports.index = function (req, res) {

    async.parallel({
        item_count: function (callback) {
            // Pass an empty object as match condition to find all documents of this collection
            Item.countDocuments({}, callback);
        },
        category_count: function (callback) {
            Category.countDocuments({}, callback);
        },
        stock_count: function (callback) {
            Stock.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Inventory Managment System', error: err, data: results });
    });

};
