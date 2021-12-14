const router = require("express").Router();
const notificationController = require("../controller/notificationController");



 router.post("/", notificationController.addNotification);

 router.get("/", notificationController.getNotifications );

 router.get("/:id", notificationController.getNotification );

 router.put("/:id", notificationController.updateNotification);

 router.delete('/:id', notificationController.deleteNotification);


module.exports = router;