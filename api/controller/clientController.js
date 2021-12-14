//Importation de mon model
const Clients = require('../model/Client');
const Codes = require('../model/Code');
const bcrypt = require("bcryptjs");

//find by Code
exports.getAllClientsFromPromo = async (req, res) => {

    const code_parin = req.params.code_parin
    if(code_parin.length != 5) return res.status(400).json({
        status: false,
        message: 'code promo invalid'
    })
    var Client=await Clients.findOne({code_promo: code_parin});
    if(!Client) return res.status(400).json({
        status: false,
        message: 'code promo incorrect'
    })
  Clients.find({code_parin: code_parin}).exec().then((result) =>{
      res.status(200).json({
          status: true,
          count: result.length,
          client: Client,
          data: result
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


//find by code scan
exports.getCodeClients = (req, res) => {

    const client = req.params.client;
    if(client.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
   var code=[];
   j=0;
  Codes.find({client:client}).exec().then((result) =>{
    for (let i = result.length-1; i >=0 ; i--) {
        code[j]=result[i];
        j++;
     }
      res.status(200).json({
          status: true,
          count: code.length,
          data: code
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


//findById(id)
exports.getClients = (req, res) => {

    var query = ""
    if(req.query.s)  query=req.query.s
   
  Clients.find({nom: {$regex: query, $options: "$i"}}).exec().then((result) =>{
      res.status(200).json({
          status: true,
          count: result.length,
          data: result
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

exports.getNbrPoint=async(req,res)=>{
    const client = req.params.client
    
    //verifier si le client existe   
    const clientExist = await Clients.findById(client);
    console.log(clientExist);
    if (!clientExist) return res.status(400).json({
        status: false,
        message:"Ce client n'existe pas!",
        nbr_point: 0
    });


     return res.status(200).json({
        status: true,
        message:"Nombre total de point!",
        nbr_point: clientExist.points
    });


}

//methode d'ajout des point d'un client
exports.setPoint= async (req, res)=>
{
    const id = req.params.id;
    var nbr_point= parseInt(req.params.nbr_point);
 
    var clientExist = await Clients.findById(id);
    if (!clientExist) return res.status(400).json({
        status: false,
        message:"Ce client n'a aucun code!",
        data: null
    });
    clientExist.points+=nbr_point;
    Clients.update({_id:id}, {$set:clientExist}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'nombre de point ajouter avec succes',
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

//Ajout d'clients
exports.addClients = async (req, res) =>{

    //verifier si l'email existe deja 
    const emailExist = await Clients.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({
        status: false,
        message: "Adresse mail déjà utilisée!"
    });
    const phoneExist = await Clients.findOne({ phone: req.body.phone });
    if (phoneExist) return res.status(400).json({
        status: false,
        message: "Numero de telephone déjà utilisée!"
    });

    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    var clt = new Clients({
        nom:req.body.nom,
        prenom:req.body.prenom,
        datenais:req.body.datenais,
        email:req.body.email,
        phone:req.body.phone,
        password: hashedPassword,
        pays:req.body.pays,
        ville:req.body.ville,
        quartier:req.body.quartier,
        points:3,
        sexe:req.body.sexe
    });
    if(req.body.code_promo) 
    {
        if(req.body.code_promo.length != 5) return res.status(400).json({
            status: false,
            message: 'veuillez saisir un code a 5 Chiffres'
        })
        var Client= await Clients.findOne({code_promo:req.body.code_promo});
        if(Client)
        return res.status(400).json({
            status: false,
            message: 'ce code est deja utiliser par une autre personne'
        })
        clt.code_promo=req.body.code_promo;
    }
    if(req.body.code_parin) 
    {
        if(req.body.code_parin.length != 5) return res.status(400).json({
            status: false,
            message: 'veuillez saisir un code a 5 Chiffres'
        })
        var Client= await Clients.findOne({code_promo:req.body.code_parin});
        if(!Client)
        return res.status(400).json({
            status: false,
            message: 'ce code promo n\'existe pas'
        })
        Client.points+=3;
        console.log(Client);
        Clients.update({_id:Client._id}, {$set:Client}).exec();
        clt.code_parin=req.body.code_parin;
    }
    
    
    clt.save().then((result)=>{
        res.status(201).json({
            status: true,
            message:'Creation réussie',
            data: result
        })
    }).catch(error =>{
        console.log(error)
        res.status(400).json({
            status: false,
            message: "Erreur serveur",
            error: error,
        })
    })

}

exports.login=async(req,res)=>{
     // Checking if the client email exist
  const client = await Clients.findOne({ email: req.body.email });
  if (!client) return res.status(400).json({
    status: false,
    message: "Email incorrect"});

  //Password is correct
  const validPassword = await bcrypt.compare(req.body.password, client.password);
  
  if (!validPassword) return res.status(400).json({
    status: false,
    message: "mot de passe incorrect"});
   return  res.status(201).json({
    status: true,   
    message:'connexion reussi',
    data: client
    });
}

//Pour retourner un seul client
exports.getClient =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    Clients.findById(id).exec().then(result => {
        res.status(200).json({
            status: true,
            message:'Client retrouvé',
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

exports.updateClient = async (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    let clt = {}
    if(req.body.nom) clt.nom=req.body.nom;
    if(req.body.points) clt.points=req.body.points;
    if(req.body.quartier) clt.quartier=req.body.quartier;
    if(req.body.ville) clt.ville=req.body.ville;
    if(req.body.pays) clt.pays=req.body.pays;
    if(req.body.password) clt.password=req.body.password;
    if(req.body.phone) clt.phone=req.body.phone;
    if(req.body.email) clt.email=req.body.email;
    if(req.body.datenais) clt.datenais=req.body.datenais;
    if(req.body.prenom) clt.prenom=req.body.prenom;
    if(req.body.sexe) clt.sexe=req.body.sexe;
    if(req.body.code_promo) 
    {
        if(req.body.code_promo.length != 5) return res.status(400).json({
            status: false,
            message: 'veuillez saisir un code a 5 Chiffres'
        })
        var Client= await Clients.findOne({code_promo:req.body.code_promo});
        if(Client)
        return res.status(400).json({
            status: false,
            message: 'ce code est deja utiliser par une autre personne'
        })
        clt.code_promo=req.body.code_promo;
    }
    

    Clients.update({_id:id}, {$set:clt}).exec().then(result => {
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

exports.deleteClient =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    

    Clients.remove({_id:id}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'client supprimer succes',
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