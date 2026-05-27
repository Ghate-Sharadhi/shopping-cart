const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const seedProducts = [
  { id: 1, name: 'Wireless Headphones', price: 1299, stock: 10, description: 'Over-ear, noise cancelling', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { id: 2, name: 'Mechanical Keyboard', price: 2499, stock: 5, description: 'TKL, RGB backlight', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
  { id: 3, name: 'USB-C Hub', price: 899, stock: 20, description: '7-in-1, 4K HDMI', image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400' },
  { id: 4, name: 'Webcam 1080p', price: 1599, stock: 8, description: 'Autofocus, built-in mic', image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?w=400' },
  { id: 5, name: 'Desk Mat XL', price: 499, stock: 15, description: '90x40cm, non-slip base', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400' },
];

// Seed products if DB is empty
router.get('/seed', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      res.json({ message: '✅ Products seeded successfully!' });
    } else {
      res.json({ message: 'Products already exist in database.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error seeding products.', error: err.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products.', error: err.message });
  }
});

module.exports = router;