var Item = require('../models/item');
var Category = require('../models/category');
var Stock = require('../models/stock');
var async = require('async');
const { body, validationResult, sanitizeCookie } = require('express-validator');

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
        .sort({ name: 1 })
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
            if (err) {
                var err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }
            if (results == null) { // No results.
                var err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('item_details', { title: 'Item Details', item: results });
        });
}

exports.delete_item_get = function (req, res, next) {
    Item.findById(req.params.id)
        .exec(function (err, item) {
            if (err) { return next(err) }
            Stock.findOne({ item: req.params.id })
                .populate('item')
                .exec(function (err, stock) {
                    if (err) { return next(err) }
                    if (stock) {
                        res.render('delete_item', { title: 'Delete item ' + item.name, item: item, stock: stock });
                    } else {
                        res.render('delete_item', { title: 'Delete item ' + item.name, item: item, stock: false });
                    }
                });
        });
}

exports.delete_item_post = function (req, res, next) {
    Item.remove({ _id: req.body.id })
        .exec(function (err) {
            if (err) { return next(err) }
            res.redirect('/inventory/items');
        });
}

exports.update_item_get = function (req, res, next) {
    async.parallel(
        {
            item: function (callback) {
                Item.findById(req.params.id, callback);
            },
            categories: function (callback) {
                Category.find({}, callback);
            }
        },
        function (err, result) {
            if (err) { return next(err) }
            res.render('update_item', { title: 'Update item ' + result.item.name, item: result.item, categories: result.categories });
        }
    )
}

exports.update_item_post = [
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

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    item: function (callback) {
                        Item.findById(req.params.id, callback);
                    },
                    categories: function (callback) {
                        Category.find({}, callback);
                    }
                },
                function (err, results) {
                    if (err) { return next(err) }
                    res.render('update_item', { title: 'Update item ' + results.item.name, item: results.item, categories: results.categories, errors: errors.array() });
                }
            )
        } else {
            Item.findByIdAndUpdate(req.params.id, {
                'name': req.body.name,
                'description': req.body.description,
                'price': req.body.price,
                'category': req.body.category
            })
                .exec(function (err) {
                    if (err) { return next(err) }
                    res.redirect('/inventory/item/' + req.params.id);
                })
        }
    }
]