const router = require("express").Router();
const controller = require("../controllers/ActivityController");

router.route("/:userId").get(controller.loadActivities);

module.exports = router;
