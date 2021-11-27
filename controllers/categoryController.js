var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.all_categories = function (req, res, next) {
    async.parallel({
        all_categories: function (callback) {
            Category.find({}, callback);
        }
    }, function (err, result) {
        res.render('categories', { title: 'Categories', error: err, data: result });
    });
};

exports.category_details = function (req, res, next) {

    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback);
        },

        items: function (callback) {
            Item.find({ category: { "$in": [req.params.id] } })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.category == null) { // No results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('category_details', { title: 'Category Details', category: results.category, items: results.items });
    });

};

exports.new_category_get = function (req, res) {
    res.render('new_category', { title: 'New Category' });
}

exports.new_category_post = [
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        var category = new Category(
            {
                name: req.body.name
            }
        );

        if (!errors.isEmpty()) {
            res.render('new_category', { title: 'New Category', errors: errors.array() });
            return;
        } else {
            Category.findOne({ 'name': req.body.name })
                .exec(function (err, found_category) {
                    if (err) { return next(err) }
                    if (found_category) {
                        res.redirect(found_category.url);
                    } else {
                        category.save(function (err) {
                            if (err) { return next(err) }
                            res.redirect(category.url);
                        })
                    }
                })
        }
    }
];
