const express = require('express');
const router = express.Router();
const Category = require("../models/category");

router.get('/:id', async (req, res) => {
    try{
        const category = Category.findOne(req.params.id)
        if(!category){
            return res.status(404).json({message: `category doesnt exist`})
        }
        res.status(200).json(category)
    }
    catch(err){
        res.status(500).json({ message: `Something went wrong`, error: err.message });  
      }
    }
)

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findOne({ name });
    if (category) {
      return res.status(409).json({ message: `Category '${name}' already exists` });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory.toObject() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


module.exports = router