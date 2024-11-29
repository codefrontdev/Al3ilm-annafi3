
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Video = require("../models/VideoModel");
const Theme = require("../models/ThemeModel");

exports.createVideo = asyncHandler(async (req, res) => {
  try {
    const { title, videoUrl, uploaderId, themes, imageUrl, reference } =
      req.body;

    if (!title || !videoUrl || !uploaderId || !themes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // التحقق من صحة قائمة الثيمات
    if (themes.length < 1 || themes.length > 3) {
      return res
        .status(400)
        .json({ message: "Themes must be between 1 and 3" });
    }

    const video = await Video.create({
      title,
      videoUrl,
      uploaderId,
      themes,
      imageUrl,
      reference,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getAllVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [{ model: Theme, as: "themes" }],
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideoById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.updateVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    await video.update(req.body);
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.destroy({ where: { id } });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosByTheme = asyncHandler(async (req, res) => {
  try {
    const { themeId } = req.params;
    const videos = await Video.findAll({
      include: [{ model: Theme, as: "themes" }],
      where: { themes: { id: themeId } },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosByUploader = asyncHandler(async (req, res) => {
  try {
    const { uploaderId } = req.params;
    const videos = await Video.findAll({
      include: [{ model: User, as: "uploader" }],
      where: { uploaderId },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
