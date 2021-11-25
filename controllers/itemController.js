var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.all_items = function (req, res, next) {
    Item.find({})
        .populate('category')
        .exec(function (err, result) {
            res.render('items', { title: 'Items', error: err, data: result });
        });
};

exports.new_item_get = function (req, res, next) {
    Category.find({})
        .exec(function (err, result) {
            if (err) return next(err);
            res.render('newItem', { title: 'New Item', categories: result });
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

                    res.render('newItem', { title: 'New Item', data: item, categories: result, errors: errors.array() });
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
