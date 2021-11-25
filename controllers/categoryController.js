var Category = require('../models/category');
var async = require('async');

exports.all_categories = function (req, res, next) {
    async.parallel({
        all_categories: function (callback) {
            Category.find({}, callback);
        }
    }, function (err, result) {
        res.render('categories', { title: 'Categories', error: err, data: result });
    });
};
