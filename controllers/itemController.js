var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.all_items = function (req, res, next) {
    Item.find({})
        .sort('name')
        .populate('category')
        .exec(function (err, result) {
            res.render('items', { title: 'Items', error: err, data: result });
        });
};

exports.new_item_get = function (req, res, next) {
    Category.find({})
        .exec(function (err, result) {
            if (err) return next(err);
            res.render('new_item', { title: 'New Item', categories: result });
        });
}

exports.new_item_post = [
    // Convert the category to an array.
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price has to be a number').isNumeric(),
    body('category', 'At least one category required').isLength({ min: 1 }),
    body('category.*').escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category
            }
        );

        if (!errors.isEmpty()) {
            Category.find({})
                .exec(function (err, result) {
                    if (err) { return next(err) }

                    res.render('new_item', { title: 'New Item', data: item, categories: result, errors: errors.array() });
                });
            return;
        } else {
            item.save(function (err) {
                if (err) { return next(err); }
                res.redirect('/inventory/items');
            });
        }
    }
];

exports.item_details = function (req, res, next) {
    Item.findById(req.params.id)
        .populate('category')
        .exec(function (err, results) {
            if (err) { return next(err); }
            if (results == null) { // No results.
                var err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('item_details', { title: results.name, item: results });
        });
}
