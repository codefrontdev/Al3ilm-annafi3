const { body, param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");



exports.createThemeValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    validatorMiddleware
]



exports.getOneThemeValidator = [
    param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),
    
    validatorMiddleware
]


exports.updateThemeValidator = [
    param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),
    validatorMiddleware
]


exports.deleteThemeValidator = [
    param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),
    validatorMiddleware
]