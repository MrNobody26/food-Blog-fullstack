const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const Recipe = require("./../model/recipeModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connection);

    console.log("DB connection successfull");
  });

//Read Json File
const recipe = JSON.parse(fs.readFileSync(`${__dirname}/recipe.json`, "utf-8"));

//import DATA into database
const importData = async () => {
  try {
    await Recipe.create(recipe);
    console.log("Data Successfully  Loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all the entries from database
const deleteData = async () => {
  try {
    await Recipe.deleteMany();
    console.log("Data Successfully  Deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
