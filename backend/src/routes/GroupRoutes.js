const router = require("express").Router();
const controller = require("../controllers/GroupController");

router.route("/").post(controller.newGroup);
router.route("/").put(controller.update).patch(controller.update);
router.route("/:userId").get(controller.loadGroups);
router.route("/:groupId/messages").get(controller.loadMessages);
router.route("/:groupId/info").get(controller.loadGroup);

module.exports = router;
