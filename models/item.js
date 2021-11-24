var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    description: {type: String, required: true},
    price: {type: Number, required: true}
  }
);

// Virtual for item's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/inventory/item/' + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema, 'items');
