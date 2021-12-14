//Importation de mon model
const client = require('../model/Client')
const Transactions = require('../model/Transaction');
const bcrypt = require("bcryptjs");



//findById(id)
exports.getTransactionsEnvoie = (req, res) => {

    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
 
  Transactions.find({client_envoie: id}).exec().then((result) =>{
    var trans=[];
    var j=0;
    for (let i = result.length-1; i >=0 ; i--) {
        trans[j]=result[i];
        j++;
     }
      res.status(200).json({
        status: true,
          count: result.length,
          data: trans
      })
  }).catch(error =>{
      console.log(error)
      res.status(500).json({
        status: false,
        message: "Code incorect",
        error: error,
      })
  })
}
//findById(id)
exports.getTransactionsRecois = (req, res) => {

    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    
  Transactions.find({client_recois: id}).exec().then((result) =>{
    var trans=[];
    var j=0;
    for (let i = result.length-1; i >=0 ; i--) {
        trans[j]=result[i];
        j++;
     }
      res.status(200).json({
        status: true,
          count: result.length,
          data: trans
      })
  }).catch(error =>{
      console.log(error)
      res.status(500).json({
        status: false,
        message: "Code incorect",
        error: error,
      })
  })
}
//Ajout d'code
exports.addTransactions =  async (req, res) =>{
    const password = req.params.password;
    const idEnvoie= req.body.client_envoie;
    const idRecois= req.body.phone;
    var clientEnvoie= await client.findById(idEnvoie);
    var clientRecois= await client.findOne({ phone: idRecois});
    console.log(JSON.stringify(clientEnvoie));
    console.log(JSON.stringify(clientRecois));
    if(!clientEnvoie || !clientRecois)
    return res.status(400).json(
        {
            status: false,
            message: "une erreur s'est produit lors du transfert"
        }
    );
   // console.log(clientEnvoie._id.localeCompare(clientRecois._id));
    console.log(clientEnvoie.phone===clientRecois.phone);
    if(clientEnvoie.phone===clientRecois.phone)
    {
        return res.status(400).json(
            {
                status: false,
                message: "vous ne pouvez pas effectuer un transfert vers vous "
            }
        );
    }
    
    
    const validPassword = await bcrypt.compare(password,clientEnvoie.password);
  
    if (!validPassword) return res.status(400).json({
      status: false,
      message: "mot de passe incorrect"});

                //debiter le compte du client qui envoie les point
    if(parseInt(req.body.point_transfert)>clientEnvoie.points)
    {
        return res.status(400).json(
            {
                status: false,
                message: "Nombre de point insuffisant"
            }
        );

    }
    clientEnvoie.points-=parseInt(req.body.point_transfert);
   

    
                //credite le compte du client qui recois les point

    clientRecois.points+=parseInt(req.body.point_transfert);
 
    var trfs = new Transactions({
        client_envoie:req.body.client_envoie,
        client_recois:clientRecois._id,
        point_transfert:req.body.point_transfert,
    });
    try{
         var client_envoie= await client.updateOne({_id:clientEnvoie._id}, {$set:clientEnvoie});
       
         var client_recois= await client.updateOne({_id:clientRecois._id}, {$set:clientRecois});
        
         if(!client_envoie || !client_recois)
         {
            res.status(400).json({
                status: false,
                message: "echec de la transaction",
            }) 
         }
         
        trfs.save().then((result)=>{
            res.status(201).json({
                status: true,
                message:'transfert de '+trfs.point_transfert+' points vers '+clientRecois.nom + ' ' + clientRecois.prenom + ' reussi',
                data: result

            })
        }).catch(error =>{
            console.log(error)
            res.status(400).json({
                status: false,
                message: "Erreur serveur " ,
                error: error.message
               
            })
        });
       
} catch (e) {
    res.status(400).json({
        status: false,
        message: "Erreur serveur",
        error: e.message,
    })
   
    
}


    
   

}

//Pour retourner un seul code
exports.getTransaction =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    Transactions.findById(id).exec().then(result => {
        res.status(200).json({
            status: true,
            message:'Transaction retrouvé',
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


exports.deleteTransaction =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    

    Transactions.remove({_id:id}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'succes',
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