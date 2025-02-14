const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.route("/").get(userController.getAllUsers);

router
  .route("/search")
  .post(userController.getUserByEmail)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
