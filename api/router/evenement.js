const router = require("express").Router();
const evenementController = require("../controller/evenementController");



 router.post("/", evenementController.addEvenement);

 router.get("/", evenementController.getEvenements );

 router.get("/:id", evenementController.getEvenement );

 router.put("/:id", evenementController.updateEvenement);

 router.delete('/:id', evenementController.deleteEvenement);


module.exports = router;