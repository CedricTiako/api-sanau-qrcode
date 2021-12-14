const mongoose = require('mongoose');
const schema= mongoose.Schema;
const notificationSchema = new schema({
      titre:{
        type: String,
        required: true
      },
      message: 
      {
        type: String,
        required: true,
        min: 4,
      },
      date: 
      {
        type: Date,
        required: false,
        default: Date.now 
      }
})

//Pour recuperer mon model créer plus haut
let  notification = mongoose.model('notification', notificationSchema)
module.exports = notification