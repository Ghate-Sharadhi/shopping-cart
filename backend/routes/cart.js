const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products — fetch all products from MongoDB
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        message: 'No products found in the database.',
      });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching products from database.',
      error: err.message,
    });
  }
});

// GET /api/products/:id — fetch single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: `No product found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching product.',
      error: err.message,
    });
  }
});

module.exports = router;