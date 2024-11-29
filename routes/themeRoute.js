
const express = require('express');
const { getThemes, createTheme, getTheme, updateTheme, deleteTheme } = require('../services/themeService');
const router = express.Router();


router.get('/', getThemes)

router.post('/', createTheme)

router.get('/:id', getTheme)

router.put('/:id', updateTheme)

router.delete('/:id', deleteTheme)



module.exports = router;





