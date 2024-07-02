const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controller/errorController");

const AppError = require("./utils/appError");
const recipeRouter = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});

app.use("/api/v1/foods", recipeRouter);

app.use("/api/v1/home", homeRouter);

app.use("/api/v1/user", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
