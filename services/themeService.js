const asyncHandler = require("express-async-handler");
const Theme = require("../models/ThemeModel");



exports.createTheme = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const theme = await Theme.create({ name });
        res.status(201).json(theme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})




exports.getThemes = asyncHandler(async (req, res) => {
    try {
        const themes = await Theme.findAll();
        res.status(200).json(themes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



exports.getTheme = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const theme = await Theme.findByPk(id);
        if (!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }
        res.status(200).json(theme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



exports.updateTheme = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const theme = await Theme.findByPk(id);
        if (!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }
        await theme.update(req.body);
        res.status(200).json(theme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



exports.deleteTheme = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const theme = await Theme.findByPk(id);
        if (!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }
        await theme.destroy();
        res.status(200).json({ message: "Theme deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


