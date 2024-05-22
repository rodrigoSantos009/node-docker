const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log(users);
    if (!users) {
      return res.status(400).json({
        status: "fail",
        message: "Users not found!",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: "fail" });
  }
};

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      username,
      password: hashPassword
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: "fail" });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found!",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (isCorrect) {
      return res.status(200).json({
        status: "success",
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect username or password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: "fail" });
  }
};