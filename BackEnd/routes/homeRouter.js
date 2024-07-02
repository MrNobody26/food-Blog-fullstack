const express = require("express");
const Recipe = require("./../model/recipeModel");
const recipeController = require("./../controller/recipeController");
const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const recipe = await Recipe.find()
      .limit(2)
      .select("title images introduction _id");

    if (recipe.length !== 2) {
      return res.status(404).json({
        status: "fail",
        message: "No Recipe Found With This ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "The request was successful ",
      data: {
        recipe,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: "Server Error",
      err,
    });
  }
  next();
});

module.exports = router;
