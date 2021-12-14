//Importation de mon model
const Notification = require('../model/Notification')

//findById(id)
exports.getNotifications = (req, res) => {

    var query = ""
    if(req.query.s)  query=req.query.s
    var notif=[];
    var j=0;
  Notification.find({titre: {$regex: query, $options: "$i"}}).exec().then((result) =>{
    for (let i = result.length-1; i >=0 ; i--) {
        notif[j]=result[i];
        j++;
     }
     //console.log(notif);
      res.status(200).json({
          count: result.length,
          data: notif
      })
  }).catch(error =>{
      console.log(error)
      res.status(500).json({
          error
      })
  })
}

//Ajout d'code
exports.addNotification = async (req, res) =>{

    var notif = new Notification({
        message:req.body.message,
        titre:req.body.titre
    })
    notif.save().then((result)=>{
        res.status(201).json({
            status: true,
            message:'Création réussie',
            data: result
        })
    })

}

//Pour retourner un seul code
exports.getNotification =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    Notification.findById(id).exec().then(result => {
        res.status(200).json({
            status: true,
            message:'Notification retrouvé',
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

exports.updateNotification =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    let notif = {}
    if(req.body.message) notif.message=req.body.message;
    if(req.body.titre) notif.titre=req.body.titre;

    Notification.update({_id:id}, {$set:notif}).exec().then(result => {
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

exports.deleteNotification =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    

    Notification.remove({_id:id}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'Notification supprimée avec succes',
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