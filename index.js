// Importer express 
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose');

const transaction = require('./api/router/transaction')
const code = require('./api/router/code')
const client = require('./api/router/client')
const notification = require('./api/router/notification')
const evenement = require('./api/router/evenement')
// Initialise l'application 
const app = express();
dotenv.config()


// Configure bodyparser to handle post requests
app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true}, (error) =>{
if(!error) console.log("Connecter a la bd sanauqrcode");
else console.log("echec de connexion a la bd sanauqrcode" + error)
});
const cors = require('cors')

app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Configuration du port du serveur 
const port = process.env.PORT || 8080 ;
// Envoyer un message pour l'URL par défaut 
app.get('/', (req, res) => res.send('Bienvenue dans l\'api node.js de SANAU GROUPE'));


app.use('/transaction', transaction);
app.use('/code', code);
app.use('/client', client);
app.use('/notification', notification);
app.use('/evenement', evenement);
// Lancer l'application pour écouter le port spécifié 
app.listen(port, function () { 
     console.log("Exécution de RestHub sur le port " + port); 
});