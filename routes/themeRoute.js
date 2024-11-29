const express = require("express");
const {
  getThemes,
  createTheme,
  getTheme,
  updateTheme,
  deleteTheme,
} = require("../services/themeService");
const {
  createThemeValidator,
  getOneThemeValidator,
  updateThemeValidator,
  deleteThemeValidator,
} = require("../utils/validator/themeValidator");
const router = express.Router();

router.get("/", getThemes);

router.post("/", createThemeValidator, createTheme);

router.get("/:id", getOneThemeValidator, getTheme);

router.put("/:id", updateThemeValidator, updateTheme);

router.delete("/:id", deleteThemeValidator, deleteTheme);

module.exports = router;
