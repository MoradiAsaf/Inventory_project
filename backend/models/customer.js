const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  username: {type:String, required:true, uniqe:true},
  //email:{type:String, required:true, uniqe:true},
  password:{type:String, required:true}
});

module.exports = mongoose.model('customer', customerSchema);
