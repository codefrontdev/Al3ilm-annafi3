const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrpt = require("bcrypt");

exports.createUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrpt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({
      username: req.body.username,
      email: req.body.email,
      passwordHash: bcrpt.hash(req.body.password, 10),
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
