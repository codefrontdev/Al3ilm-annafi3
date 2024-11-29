const express = require("express");
const {
  getAllVideos,
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../services/videoService");
const router = express.Router();

router.get("/", getAllVideos);

router.post("/", createVideo);

router.get("/:id", getVideoById);

router.put("/:id", updateVideo);

router.delete("/:id", deleteVideo);

module.exports = router;
