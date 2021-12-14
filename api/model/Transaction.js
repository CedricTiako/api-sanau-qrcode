const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  client_envoie:{
    type: mongoose.Types.ObjectId,
    ref: "client",
    required:false
   },
   client_recois:{
    type: mongoose.Types.ObjectId,
    ref: "client",
    required:false
   },
   point_transfert:{
    type: Number,
    required:true,
   },
  date: {
    type: Date,
    required: false,
    default: Date.now,  
  },
});

module.exports = mongoose.model("transaction", transactionSchema);