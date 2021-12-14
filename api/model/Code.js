const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const codeSchema = new Schema({
  client:{
    type: mongoose.Types.ObjectId,
    ref: "client",
    required:false
   },

  description: {
    type: String,
    required: true,
    min: 10,    
  },

  
  nbr_point: {
    type: Number,
    required: true
  },

  gamme: {
    type: String,
    required: true,
  },
  
  quartier: {
    type: String,
    required: true,
  },
  heureScan:{
    type: Date,
    default: null,
    requiered: false
  },

  status: {
    type: Boolean,
    default: false,
    required: false,
  },
});

let  code = mongoose.model('code', codeSchema)
module.exports = code