const { json } = require("express");
const Recipe = require("./../model/recipeModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllRecipe = async (req, res, next) => {
  const searchTerm = req.query.title;

  let recipe;
  if (searchTerm) {
    // If searchTerm is provided, search for foods with matching title
    recipe = await Recipe.find({
      title: { $regex: searchTerm, $options: "i" },
    });
    if (recipe.length === 0) {
      res.status(404).json({ status: "success", message: "Content not Found" });
    } else {
      res.json({
        status: "success",
        message: "here is requested content",
        data: { recipe },
      });
    }
  } else {
    // If searchTerm is not provided, get all foods
    recipe = await Recipe.find();
    res.status(200).json({
      status: "success",
      message: "here is all recipes",
      data: { recipe },
    });
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        status: "fail",
        message: "No Recipe found with this ID",
        err,
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "Here is requested Recipe",
        data: {
          recipe,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "server Error",
      err,
    });
  }
};

exports.createRecipe = catchAsync(async (req, res, next) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        recipe: newRecipe,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "server Error, cannot be created",
      err,
    });
  }
});

exports.updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        recipe,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "server Error",
      err,
    });
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      res.status(404).json({
        status: "fail",
        message: "No Recipe Found With This ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: {
        recipe: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Server Error",
      err,
    });
  }
};

// exports.getTwoItem =
