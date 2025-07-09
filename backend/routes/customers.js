const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const bcryptjs = require("bcryptjs")
const generateToken = require("../utils/jwtUtils")

router.post('/signup', async (req, res) => {
    try {
    const { username, password} = req.body;
     const customer = await Customer.findOne({username});
     if (customer) {
       return res.status(400).json({message: "Username  already taken"});
     }
     const hashedPassword = await bcryptjs.hash(password, 10)
     
     const newCustomer = new Customer({username, password: hashedPassword})
     await newCustomer.save()
   
     const token = generateToken(customer.id)
   
   
     res.cookie('token', token, {
       httpOnly: true,
       sameSite: 'strict',
       secure: false,
       maxAge: 3600000 
     });
   
   
   
     res.status(201).json({message: `User ${username} created successfully`})}
     catch(err){
       res.status(500).json({message: `something went wrong, error: ${err} `})
     }
   })

   router.post('/login', async (req, res) => {
    try{
      const {username, password} = req.body
      const customer = await Customer.findOne({username})
      console.log("customer found:", customer);
  
      if(!customer){
        return res.status(401).json({ "error": "Invalid username or password"})
      }
      const isMatch = await bcryptjs.compare(password, customer.password)
      if(!isMatch){
        return res.status(401).json({ "error": "Invalid username or password"})
      }
      const token = generateToken(customer.id)
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 360000
      })
  
      res.status(200).json({message: "logged in successfuly!"})
  
      
    }
    catch(err){
      res.status(500).json({message: `something went wrong, error: ${err} `})
    }
  })

  module.exports = router;