const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, required: true, min: 1 },
  stock: Number,
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);