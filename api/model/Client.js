const mongoose = require('mongoose');
const schema= mongoose.Schema;
const clientSchema = new schema({
    nom: {
        type: String,
        required: true,
        min: 4,
        max: 255,
      },
    
      prenom: {
        type: String,
        required: true,
        min: 4,
        max: 255,
      },
    
      datenais: {
        type: Date,
        required: true
      },
    
      email: {
        type: String,
        required: true,
        min: 6,
        max: 255
      },
    
      phone: {
        type: String,
        required: true,
        min: 9,
      },
      
      password: {
        type: String,
        required: true,
        min: 8,
        max: 100,
      },
    
      pays: {
        type: String,
        required: true,
      },
    
      ville: {
        type: String,
        required: true,
      },
    
      quartier: {
        type: String,
        required: true,
      },
    
      points: {
        type: Number,
        default: 0,
        required: false,
      },
    
      sexe: {
        type: String,
        required: true,
      },
      code_promo:
      {
        type: String,
        required: false,
        maxlength: 5,
        minlength: 5
      },
      code_parin:
      {
        type: String,
        required: false,
        maxlength: 5,
        minlength: 5,
      }


})

//Pour recuperer mon model créer plus haut
let  client = mongoose.model('client', clientSchema)
module.exports = client