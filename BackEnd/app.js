const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const recipeRouter = require("./routes/recipeRoutes");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/v1/foods", recipeRouter);

module.exports = app;
