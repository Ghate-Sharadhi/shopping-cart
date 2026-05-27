const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// All cart routes require login
router.use(authMiddleware);

// GET /cart
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart || cart.items.length === 0) {
      return res.json({ items: [], total: 0 });
    }
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cart.items, total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart.', error: err.message });
  }
});

// POST /cart/add
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Please provide a valid productId and quantity (minimum 1).' });
    }

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: `Product with ID ${productId} not found.` });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) cart = new Cart({ userId: req.user.userId, items: [] });

    const existingItem = cart.items.find(item => item.productId === productId);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQty + quantity;

    if (totalRequested > product.stock) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.stock} unit(s) available, and you already have ${currentQty} in your cart.`
      });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name: product.name, price: product.price, image: product.image, quantity, stock: product.stock });
    }

    await cart.save();
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ message: `${product.name} added to cart!`, items: cart.items, total });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart.', error: err.message });
  }
});

// PATCH /cart/update
router.patch('/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }

    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart.' });

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findOne({ id: productId });
      if (quantity > product.stock) {
        return res.status(400).json({ message: `Cannot set quantity to ${quantity}. Only ${product.stock} unit(s) in stock.` });
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ message: 'Cart updated!', items: cart.items, total });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart.', error: err.message });
  }
});

// DELETE /cart/remove/:productId
router.delete('/remove/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ message: 'Cart is empty.' });

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart.' });

    const removedName = cart.items[itemIndex].name;
    cart.items.splice(itemIndex, 1);
    await cart.save();

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ message: `${removedName} removed from cart.`, items: cart.items, total });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item.', error: err.message });
  }
});

// POST /cart/place-order
router.post('/place-order', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty. Add items before placing an order.' });
    }
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderSummary = { items: [...cart.items], total };
    cart.items = [];
    await cart.save();
    res.json({ message: '🎉 Order placed successfully!', order: orderSummary });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order.', error: err.message });
  }
});

module.exports = router;