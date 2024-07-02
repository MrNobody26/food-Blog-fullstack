const { json } = require("express");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    message: "here is all users",
    data: { users },
  });
});
exports.getUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.find({ email });
  if (!user) {
    return next(new AppError("No User Found With This Email ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOneAndUpdate(
    { email },
    { password: password },
    { new: true }
  );

  if (!user) {
    return next(new AppError("No User Found With This Email ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return next(new AppError("No User Found With This Email ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: {
      user: null,
    },
  });
});
