const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    req.session.user = newUser;
    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });
    } else {
      req.session.user = user;
      res.status(200).json({
        status: "success",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
