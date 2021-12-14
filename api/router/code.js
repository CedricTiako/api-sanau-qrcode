const router = require("express").Router();
const codeController = require("../controller/codeController");



 router.post("/", codeController.addCodes);

 router.get("/", codeController.getCodes );

 router.get("/:id", codeController.getCode );
 
 router.get("/liste/:status",codeController.getCodeClient)

 router.put("/", codeController.verifier);

 router.put("/mod/:id", codeController.updateCode);

 router.delete('/:id', codeController.deleteCode);


module.exports = router;