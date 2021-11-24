var async = require('async');
var Item = require('../models/item');
var Category = require('../models/category');

exports.index = function (req, res) {

    async.parallel({
        item_count: function (callback) {
            // Pass an empty object as match condition to find all documents of this collection
            Item.countDocuments({}, callback);
        },
        category_count: function (callback) {
            Category.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Inventory Managment Tool', error: err, data: results });
    });

};
