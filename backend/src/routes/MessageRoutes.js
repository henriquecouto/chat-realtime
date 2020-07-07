const router = require("express").Router();
const controller = require("../controllers/MessageController");

router.route("/").post(controller.loadMessages);

module.exports = router;
