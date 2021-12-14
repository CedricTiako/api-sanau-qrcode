const router = require("express").Router();
const clientController = require("../controller/clientController");


router.post("/",clientController.addClients);

router.post("/login",clientController.login);

router.get("/nbr_point/:client",clientController.getNbrPoint);

router.get("/promo/:code_parin",clientController.getAllClientsFromPromo);

router.get("/codes/:client",clientController.getCodeClients);

router.put("/:id/:nbr_point",clientController.setPoint);

router.get("/", clientController.getClients );

router.get('/:id', clientController.getClient);

router.put("/:id", clientController.updateClient);

router.delete('/:id', clientController.deleteClient);


module.exports = router;