var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 100 }
    }
);

// Virtual for category's URL
CategorySchema
    .virtual('url')
    .get(function () {
        return '/inventory/category/' + this._id;
    });

//Export model
module.exports = mongoose.model('Category', CategorySchema, 'categories');
