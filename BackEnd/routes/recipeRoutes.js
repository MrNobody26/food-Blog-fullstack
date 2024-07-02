const express = require("express");
const router = express.Router();
const recipeController = require("./../controller/recipeController");
const authController = require("./../controller/authController");

router
  .route("/")
  .get(authController.protect, recipeController.getAllRecipe)
  .post(recipeController.createRecipe);

router
  .route("/:id")
  .get(authController.protect, recipeController.getRecipeById)
  .patch(recipeController.updateRecipe)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    recipeController.deleteRecipe
  );

module.exports = router;
