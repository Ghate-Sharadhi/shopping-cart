require("dotenv").config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Product = require('../models/Product');

const products = [
  {
    name: 'Wireless Headphones',
    price: 1299,
    stock: 10,
    description: 'Over-ear, noise cancelling',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
  {
    name: 'Mechanical Keyboard',
    price: 2499,
    stock: 5,
    description: 'TKL, RGB backlight',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
  },
  {
    name: 'USB-C Hub',
    price: 899,
    stock: 20,
    description: '7-in-1, 4K HDMI',
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400',
  },
  {
    name: 'Webcam 1080p',
    price: 1599,
    stock: 8,
    description: 'Autofocus, built-in mic',
    image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?w=400',
  },
  {
    name: 'Desk Mat XL',
    price: 499,
    stock: 15,
    description: '90x40cm, non-slip base',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log('⚠️  Products already exist in database. Skipping seed.');
      process.exit(0);
    }

    await Product.insertMany(products);
    console.log('✅ Products seeded successfully into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();