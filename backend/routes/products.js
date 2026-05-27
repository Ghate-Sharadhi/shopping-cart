const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');

// All cart routes require login
router.use(protect);

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: 'Your cart is empty.',
        items: [],
        total: 0,
      });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({ items: cart.items, total });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching cart.',
      error: err.message,
    });
  }
});

// POST /api/cart/add
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: 'productId is required.',
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1.',
      });
    }

    // Fetch product from MongoDB — no hardcoded data
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: `Product not found in database.`,
      });
    }

    // Get or create cart for this user
    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    const currentQty = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQty + quantity;

    if (totalRequested > product.stock) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.stock} unit(s) available for "${product.name}", and you already have ${currentQty} in your cart.`,
      });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity,
      });
    }

    await cart.save();

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({
      message: `"${product.name}" added to cart successfully!`,
      items: cart.items,
      total,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error adding item to cart.',
      error: err.message,
    });
  }
});

// PATCH /api/cart/update
router.patch('/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required.' });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        message: 'Quantity must be 0 or more. Send 0 to remove the item.',
      });
    }

    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'This item was not found in your cart.',
      });
    }

    if (quantity === 0) {
      const removedName = cart.items[itemIndex].name;
      cart.items.splice(itemIndex, 1);
      await cart.save();
      const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return res.status(200).json({
        message: `"${removedName}" removed from cart.`,
        items: cart.items,
        total,
      });
    }

    // Validate against real stock in MongoDB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product no longer exists.' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Cannot update quantity to ${quantity}. Only ${product.stock} unit(s) in stock for "${product.name}".`,
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({
      message: 'Cart updated successfully!',
      items: cart.items,
      total,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating cart.',
      error: err.message,
    });
  }
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'Your cart is already empty.' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'This item was not found in your cart.',
      });
    }

    const removedName = cart.items[itemIndex].name;
    cart.items.splice(itemIndex, 1);
    await cart.save();

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({
      message: `"${removedName}" has been removed from your cart.`,
      items: cart.items,
      total,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error removing item from cart.',
      error: err.message,
    });
  }
});

// POST /api/cart/place-order
router.post('/place-order', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Your cart is empty. Please add items before placing an order.',
      });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderSummary = {
      items: [...cart.items],
      total,
      placedAt: new Date(),
    };

    // Clear the cart after order
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: '🎉 Order placed successfully! Thank you for shopping.',
      order: orderSummary,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error placing order.',
      error: err.message,
    });
  }
});

module.exports = router;