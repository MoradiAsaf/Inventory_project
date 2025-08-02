const express = require('express');
const router = express.Router();
const Supplier = require("../models/supplier");
const authAdmin = require("../middleware/authAdmin");


router.post('/', authAdmin, async (req, res) => {
    const {name, contact_name, phone, email, notes} = req.body
    const supplier = await Supplier.findOne({name})
    if(supplier){
        return res.status(404).json({massege: `suppllier ${name} already exist`})
    }
    try{
        const newSupplier = new Supplier({name, contact_name, phone, email, notes})
        await newSupplier.save()
        res.status(201).json({massege: `supplier ${name} created successfully`})

    }
    catch(err){
          res.status(500).json({ message: `Something went wrong`, error: err.message });    }
} )

router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find()
        res.status(200).json(suppliers)
    } catch (err) {
        res.status(500).json({ message: `Something went wrong`, error: err.message });    }
})

router.get('/:id', async (req, res) => {
    
    try{
        const supplier = await Supplier.findOne(req.params.id)
        if(!supplier){
            return res.status(404).json({massege: `suppllier not found`})
        }
        res.status(200).json(supplier)
    }
    catch(err){
        res.status(500).json({ message: `Something went wrong`, error: err.message });    }


})

router.put('/:id', authAdmin, async (req, res) => {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
  
      res.status(200).json(supplier);
    } catch (err) {
      res.status(500).json({ message: `Something went wrong`, error: err.message });
    }
  });
  

  router.patch('/:id/activate', authAdmin, async (req, res) => {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
    if (!supplier) return res.status(404).json({ message: 'supplier not fount' });
    res.status(200).json(supplier);
  });
  


  router.patch('/:id/deactivate', authAdmin, async (req, res) => {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
    if (!supplier) return res.status(404).json({ message: 'supplier not fount' });
    res.status(200).json(supplier);
  });
  

  module.exports = router