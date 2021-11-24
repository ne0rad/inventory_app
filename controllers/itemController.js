var Item = require('../models/item');
var async = require('async');

exports.allItems = function (req, res, next) {
    async.parallel({
        all_items: function (callback) {
            Item.find({}, callback);
        }
    }, function (err, result) {
        res.render('items', { title: 'Items', error: err, data: result });
    });
};
