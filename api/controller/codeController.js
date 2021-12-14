//Importation de mon model
const Clients=require('../model/Client');
const Codes = require('../model/Code');
const bcrypt = require("bcryptjs");

//findById(id)
exports.getCodes = (req, res) => {

    var query = ""
    if(req.query.s)  query=req.query.s
   
  Codes.find({description: {$regex: query, $options: "$i"}}).exec().then((result) =>{
      res.status(200).json({
          count: result.length,
          data: result
      })
  }).catch(error =>{
      console.log(error)
      res.status(500).json({
          error
      })
  })
}

//Ajout d'code
exports.addCodes = async (req, res) =>{

    
    var cde = new Codes({
        description:req.body.description,
        nbr_point:req.body.nbr_point,
        gamme:req.body.gamme,
        quartier:req.body.quartier,
        status:req.body.status,
    })
    cde.save().then((result)=>{
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
    });

}



//api de verification du code
exports.verifier = async (req, res)=>{
   
    // const salt = await bcrypt.genSalt(10);
    const description = req.body.description;
    
    // let hasheddescription = await bcrypt.hash(description, salt);
    // console.log(hasheddescription);
    //verifier si la description existe  
    const descriptionExist = await Codes.findOne({ description: description });
    if (!descriptionExist) return res.status(400).json({
        status: false,
        message:`ce code n'est pas un Qr Code CMR+!`});
    if(descriptionExist.status) return res.status(400).json({
        status: false,
        message:"Ce code à déja été utilisé"});

    descriptionExist.status=true;
    descriptionExist.heureScan=Date();
    Codes.update({_id:descriptionExist.id}, {$set:descriptionExist}).exec().then(result => {
       res.status(200).json({
            status: true,
            message : 'succes',
            data : descriptionExist
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

//Pour retourner un seul code
exports.getCodeClient = async (req, res) => {
    const status =  req.params.status
    if(status.toLowerCase()=='false') 
    {
        Codes.find({status:false}).exec().then(result => {
        return    res.status(200).json({
                status: true,
                message:'Code retrouvé',
                count: result.length,
                data :result
            })
        }).catch(error =>{
            console.log(error)
            return   res.status(500).json({
                status: false,
                message: "Erreur serveur",
                error: error,
            })
        })  
    }
    else{
        Codes.find({status:true}).exec().then( async (result) => {
            var obj=new Object();
            var result2=[];
            var i=0;
            
            for(k=0;k<result.length;k++)
            {
                obj._id=result[k]._id;
                obj.description=result[k].description;
                obj.nbr_point=result[k].nbr_point;
                obj.gamme=result[k].gamme;
                obj.quartier=result[k].quartier;
                obj.status=result[k].status;
                const client= await Clients.findById(result[k].client);
               // console.log(JSON.stringify(client));
                obj.client=client;
                result2[i]=obj;
                i++;
             //    console.log(JSON.stringify(obj));
            }
            return   res.status(200).json({
                status: true,
                count: result2.length,
                message:'Codes retrouvé',
                data :result2
            })
        }).catch(error =>{
            console.log(error)
            return  res.status(500).json({
                status: false,
                message: "Erreur serveur",
                error: error,
            })
        })
    }
    
    
}

//Pour retourner un seul code
exports.getCode =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    Codes.findById(id).exec().then(result => {
        res.status(200).json({
            status: true,
            message:'Code retrouvé',
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

exports.updateCode =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    let cde = {}
    if(req.body.client) cde.client=req.body.client;
    if(req.body.description) cde.description=req.body.description;
    if(req.body.quartier) cde.quartier=req.body.quartier;
    if(req.body.nbr_point) cde.nbr_point=req.body.nbr_point;
    if(req.body.gamme) cde.gamme=req.body.gamme;
   

    Codes.update({_id:id}, {$set:cde}).exec().then(result => {
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

exports.deleteCode =  (req, res) => {
    const id = req.params.id
    if(id.length != 24) return res.status(400).json({
        status: false,
        message: 'id invalid'
    })
    

    Codes.remove({_id:id}).exec().then(result => {
        res.status(200).json({
            status: true,
            message : 'code supprimer avec succes',
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