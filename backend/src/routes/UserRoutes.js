const router = require("express").Router();
const controller = require("../controllers/UserController");

router.route("/").post(controller.newUser);
router.route("/").get(controller.loadUsers);

module.exports = router;
