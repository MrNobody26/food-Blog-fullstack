const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "The recipe must have a Name"],
    unique: true,
    trim: true,
    minlength: [
      10,
      "Recipe name must have length of more or equal to 10 caracter",
    ],
  },
  introduction: {
    type: String,
    required: [true, "Every Recipe must have an introduction"],
    trim: true,
  },
  body: {
    ingredients: {
      type: [String],
      required: [true, "Recipe must have Ingredients"],
      trim: true,
    },
    steps: {
      type: [String],
      required: [true, "Recipe must have Steps"],
      trim: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  images: [String],
  tips: [String],
  nutrition: {
    calories: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbohydrates: {
      type: Number,
      default: 0,
    },
    fiber: {
      type: Number,
      default: 0,
    },
  },
  source: String,
  conclusion: String,
  authorBio: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
