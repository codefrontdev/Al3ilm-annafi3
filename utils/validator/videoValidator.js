const { body, param, query, check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createVideoValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters long"),

  body("videoUrl")
    .notEmpty()
    .withMessage("Video URL is required"),

  body("uploaderId")
    .notEmpty()
    .withMessage("Uploader ID is required")
    .isUUID()
    .withMessage("Uploader ID must be a valid UUID"),

  body("themes")
    .isArray()
    .withMessage("Themes must be an array")
    .custom((value) => {
      
      if (value.length < 1 || value.length > 3) {
        throw new Error("Themes array must contain between 1 and 3 items");
      }
      return true;
    }),

  body("imageUrl")
    .optional(),

  body("reference")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Reference must not exceed 255 characters"),
  validatorMiddleware,
];

exports.updateVideoValidator = [
  param("id")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),

  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters long"),

  body("videoUrl")
    .optional(),

  body("themes")
    .optional()
    .isArray()
    .withMessage("Themes must be an array")
    .custom((value) => {
      
      if (value.length < 1 || value.length > 3) {
        throw new Error("Themes array must contain between 1 and 3 items");
      }
      return true;
    }),

  body("imageUrl")
    .optional(),

  body("reference")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Reference must not exceed 255 characters"),
  validatorMiddleware,
];

exports.validateVideoValidation = [
  param("id")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  body("status")
    .notEmpty()
    .isIn(["approved", "rejected"])
    .withMessage("Status must be 'approved' or'rejected'"),
  validatorMiddleware,
];

exports.getValidVideosValidator = [
  param("id")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  validatorMiddleware,
];

exports.getVideosNotValidValidator = [
  param("id")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  validatorMiddleware,
];

exports.getVideosByUploaderValidator = [
  param("uploaderId")
    .notEmpty()
    .withMessage("Uploader ID is required")
    .isUUID()
    .withMessage("Uploader ID must be a valid UUID"),
  validatorMiddleware,
];

exports.getVideosByThemeValidator = [
  param("id")
    .notEmpty()
    .withMessage("Theme ID is required")
    .isUUID()
    .withMessage("Theme ID must be a valid UUID"),
  validatorMiddleware,
];

exports.getVideosValidator = [
  query("title")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),

  query("uploaderId")
    .optional()
    .isUUID()
    .withMessage("Uploader ID must be a valid UUID"),

  query("themes")
    .optional()
    .isArray()
    .withMessage("Themes must be an array")
    .custom((value) => {
      if (value.length < 1 || value.length > 3) {
        throw new Error("Themes array must contain between 1 and 3 items");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getVideoValidator = [
  param("id")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  validatorMiddleware,
];

exports.deleteVideoValidator = [
  param("id")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  validatorMiddleware,
];


exports.addThemesValidator = [
  check("videoId")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  check("themes")
    .isArray({ max: 3 })
    .withMessage("Themes must be an array with a maximum of 3 items."),
  validatorMiddleware,
];

exports.removeThemeValidator = [
  check("videoId")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  check("themeId")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  validatorMiddleware,
];

exports.updateThemesValidator = [
  check("videoId")
    .notEmpty()
    .withMessage("Video ID is required")
    .isUUID()
    .withMessage("Video ID must be a valid UUID"),
  check("themes")
    .isArray({ max: 3 })
    .withMessage("Themes must be an array with a maximum of 3 items."),
  validatorMiddleware,
];
