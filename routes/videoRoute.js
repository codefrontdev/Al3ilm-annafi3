const express = require("express");
const {
  getAllVideos,
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideosIsValidByTheme,
  getVideosNotValidByTheme,
  getVideosByUploader,
  getVideosByTheme,
  validateVideo,
  addThemesToVideo,
  removeThemeFromVideo,
  updateThemesForVideo,
  addLikes,
  removeLikes,
} = require("../services/videoService");
const {
  createVideoValidator,
  getVideoValidator,
  updateVideoValidator,
  deleteVideoValidator,
  validateVideoValidation,
  getValidVideosValidator,
  getVideosNotValidValidator,
  getVideosByUploaderValidator,
  getVideosByThemeValidator,
  addThemesValidator,
  removeThemeValidator,
  updateThemesValidator,
} = require("../utils/validator/videoValidator");
const router = express.Router();


router.post("/themes", addThemesValidator, addThemesToVideo);
router.delete("/themes", removeThemeValidator, removeThemeFromVideo);
router.put("/themes", updateThemesValidator, updateThemesForVideo);


router.post("/:id/like", addLikes);
router.delete("/:id/like", removeLikes);


router.get("/", getAllVideos);

router.post("/", createVideoValidator, createVideo);

router.get("/validate/:id", validateVideoValidation, validateVideo);

router.get(
  "/isvalid/theme/:id",
  getValidVideosValidator,
  getVideosIsValidByTheme
);

router.get(
  "/notvalid/theme/:id",
  getVideosNotValidValidator,
  getVideosNotValidByTheme
);




router.get("/uploader/:id", getVideosByUploaderValidator, getVideosByUploader);

router.get("/theme/:id", getVideosByThemeValidator, getVideosByTheme);

router.get("/:id", getVideoValidator, getVideoById);

router.put("/:id", updateVideoValidator, updateVideo);

router.delete("/:id", deleteVideoValidator, deleteVideo);

module.exports = router;
