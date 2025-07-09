const express = require("express");
const router = express.Router();
const Product = require("../models/products");

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('supplier').populate('category');
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products available" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier').populate('category');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      sku,
      supplier,
      category,
      price_company,
      price_customer,
      quantity_in_stock,
      unit,
      notes
    } = req.body;

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ message: `Product '${name}' already exists` });
    }

    const newProduct = new Product({
      name,
      sku,
      supplier,
      category,
      price_company,
      price_customer,
      quantity_in_stock,
      unit,
      notes
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = router;
