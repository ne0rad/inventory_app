var Item = require('../models/item');
var Category = require('../models/category');
var Stock = require('../models/stock');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.all_stock = function (req, res) {
    res.send('Not implemented yet');
}

exports.stock_details = function (req, res) {
    res.send('Not implemented yet');
}

exports.new_stock_get = function (req, res) {

    Item.find({})
        .sort({ 'name': 1 })
        .exec(function (err, result) {
            if (err) { return next(err); }
            res.render('new_stock', { title: 'New Stock', items: result });
        });
}

exports.new_stock_post = [
    body('item', 'You must choose and item.').trim().isLength({ min: 1 }).escape(),
    body('count', 'Valid item count required (1-1000).').trim().isInt({ min: 1, max: 1000 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        var stock = new Stock(
            {
                item: req.body.item,
                count: req.body.count
            }
        );

        if (!errors.isEmpty()) {
            Item.find({})
                .sort({ 'name': 1 })
                .exec(function (err, result) {
                    if (err) { return next(err); }
                    res.render('new_stock', { title: 'New Stock', items: result, errors: errors.array() });
                });
            return;
        } else {
            Stock.findOne({ 'item': req.body.item })
                .exec(function (err, found_item) {
                    if (err) { return next(err) }
                    if (found_item) {
                        res.redirect(found_item.url);
                    } else {
                        stock.save(function (err) {
                            if (err) { return next(err) }
                            res.redirect(stock.url);
                        })
                    }
                })
        }
    }
];