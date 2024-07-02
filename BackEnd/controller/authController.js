const { promisify } = require("util");
const crypto = require("crypto");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const AppError = require("../utils/appError");
const sendMail = require("../utils/email");
const { log } = require("console");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  console.log("inside SignUp");
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = signToken(newUser._id);
    console.log(token);
    return res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: "fail",
      message: "Server Error",
    });
  }
  next();
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "Fail",
      message: "Please provide email and password",
      err,
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "Fail",
      message: "Incorrect email or password",
    });
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
  next();
};

exports.protect = async (req, res, next) => {
  let token, decoded, currentUser;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "you are not logged in please login to get access",
    });
  }

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      status: "fail",
      message: "invalid token, please log in again",
    });
  }

  currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "the user belonging to this token does not exsist",
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "the user changed the password log in again",
    });
  }

  req.user = currentUser;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(401).json({
        status: "fail",
        message: "you are not authorized to perform this action",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSaving: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a Patch request with your new password to : ${resetUrl}.\n if you forgot your password then ignore this message`;

  try {
    sendMail({
      email: user.email,
      subject: "your password reset token (Valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token Sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSaving: false });
    return res.status(500).json({
      status: "fail",
      message: "there was an error sending email. Try again later",
    });
  }
  next();
};

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or token has expired",
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });

  next();
};
