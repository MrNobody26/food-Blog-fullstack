const express = require("express");
const Recipe = require("./../model/recipeModel");
const catchAsync = require("./../utils/catchAsync");

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const recipe = await Recipe.find().select("title images introduction _id");

    res.status(200).json({
      status: "success",
      message: "The request was successful",
      data: {
        recipe,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Here is requested Product",
      data: {
        recipe,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
});

module.exports = router;
