const mongoose = require('mongoose');
const schema= mongoose.Schema;
const evenementSchema = new schema({
      titre:{
        type: String,
        required: true
      },
      description: 
      {
        type: String,
        required: true,
        min: 4,
      },
      date: 
      {
        type: Date,
        required: true
      },
      status:
      {
          type: Boolean,
          required: false,
          default: true  
      }

})

//Pour recuperer mon model créer plus haut
let  evenement = mongoose.model('evenement', evenementSchema)
module.exports = evenement