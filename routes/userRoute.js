const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/userService");
const {
  createUserValidator,
  getOneUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validator/userValidator");
const router = express.Router();

router.get("/", getUsers);

router.post("/", createUserValidator, createUser);

router.get("/:id", getOneUserValidator, getUser);

router.put("/:id", updateUserValidator, updateUser);

router.delete("/:id", deleteUserValidator, deleteUser);

module.exports = router;
