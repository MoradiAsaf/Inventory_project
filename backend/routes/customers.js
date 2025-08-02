const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const bcryptjs = require("bcryptjs")
const { generateToken } = require("../utils/jwtUtils")
const authMiddleware = require("../middleware/authMiddleware")
const CustomerCart = require("../models/customerCart");


router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, full_name, phone, address, payment_method, billing_day } = req.body;
    const customer = await Customer.findOne({ username });
    if (customer) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const emailExists = await Customer.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const newCustomer = new Customer({
      username,
      email,
      password: hashedPassword,
      full_name,
      phone,
      address,
      payment_method,
      billing_day
    });
    await newCustomer.save()
    await CustomerCart.create({
      customer: newCustomer._id,
      items: [],
      delivery_date: null
    });

    const token = generateToken(newCustomer._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 3600000
    });




    res.status(201).json({ message: `User ${username} created successfully` })
  }
  catch (err) {
    res.status(500).json({ message: `something went wrong, error: ${err} ` })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const customer = await Customer.findOne({ username })
    console.log("customer found:", customer);

    if (!customer) {
      return res.status(401).json({ "error": "Invalid username or password" })
    }
    const isMatch = await bcryptjs.compare(password, customer.password)
    if (!isMatch) {
      return res.status(401).json({ "error": "Invalid username or password" })
    }
    const token = generateToken(customer._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 3600000
    });


    res.status(200).json({
      message: "logged in successfuly!",
      customer: { _id: customer._id }
    });
    
    

  }
  catch (err) {
    res.status(500).json({ message: `something went wrong, error: ${err} ` })
  }
})

router.post('/logout', async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logged out successfully" });
})



// שליפת פרטי לקוח לפי ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


// עדכון פרטי לקוח
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const allowedUpdates = ['full_name', 'phone', 'address', 'payment_method', 'billing_day'];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


// מחיקת לקוח (לא חובה)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


module.exports = router;