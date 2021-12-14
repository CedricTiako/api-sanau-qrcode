const router = require("express").Router();
const transactionController = require("../controller/transactionController");


router.post("/:password",transactionController.addTransactions);

router.get("/:id", transactionController.getTransaction );

router.get('/envoie/:id', transactionController.getTransactionsEnvoie);

router.get("/recois/:id", transactionController.getTransactionsRecois);

router.delete('/:id', transactionController.deleteTransaction);


module.exports = router;