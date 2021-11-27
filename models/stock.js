var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StockSchema = new Schema(
    {
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        count: { type: Number, required: true }
    }
);

// Virtual for item's URL
StockSchema
    .virtual('url')
    .get(function () {
        return '/inventory/stock/' + this._id;
    });

//Export model
module.exports = mongoose.model('Stock', StockSchema, 'stocks');
