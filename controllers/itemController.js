var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');

exports.allItems = function (req, res, next) {
    Item.find({})
        .populate('category')
        .exec(function (err, result) {
            res.render('items', { title: 'Items', error: err, data: result });
        });
};

exports.newItemGet = function (req, res, next) {
    res.render('newItem', { title: 'New Item' });
}

exports.newItemPost = function (req, res, next) {
    res.redirect('/inventory/items');
}
