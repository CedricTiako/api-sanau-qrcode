//Importation de mon model
const Evenement = require('../model/Evenement')

//findById(id)
exports.getEvenements = (req, res) => {

    var query = ""
    if(req.query.s)  query=req.query.s
   var event=[];
   var j=0;
  Evenement.find({titre: {$regex: query, $options: "$i"}}).exec().then((result) =>{
    for (let i = result.length-1; i >=0 ; i--) {
       event[j]=result[i];
       j++;
    }
     // console.log(event);
      res.status(200).json({
          count: result.length,
          data: event
      })
  }).catch(error =>{
      console.log(error)
      res.status(500).json({
          error
      })
  })
}

//Ajout d'code
exports.addEvenement = async (req, res) =>{

    var event = new Evenement({
        description:req.body.description,
        titre:req.body.titre,
        date:req.body.date
    })
    event.save().then((result)=>{
        res.status(201).json({
            status: true,
            message:'Création réussie',
            data: result
        })
    })

}

//Pour retourner un seul code
exports.getEvenement =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    Evenement.findById(id).exec().then(result => {
        
    
        res.status(200).json({
            status: true,
            message:'Evenement retrouvé',
            data :result
        })
    }).catch(error =>{
        console.log(error)
        res.status(500).json({
            status: false,
            message: "Erreur serveur",
            error: error,
        })
    })
}
//update

exports.updateEvenement =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    let event = {}
    if(req.body.description) event.description=req.body.description;
     if(req.body.titre) event.titre=req.body.titre;
    if(req.body.date) event.date=req.body.date;

    Evenement.update({_id:id}, {$set:event}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'modification reussi',
            data : result
        })

    }).catch(error =>{
        console.log(error)
        res.status(500).json({
            status: false,
            message: "Erreur serveur",
            error: error,
        })
    })
}

exports.deleteEvenement =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    

    Evenement.remove({_id:id}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'Evenement supprimer avec succes',
            data : result
        })

    }).catch(error =>{
        console.log(error)
        res.status(500).json({
            status: false,
            message: "Erreur serveur",
            error: error,
        })
    })
}