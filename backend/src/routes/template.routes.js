// server/src/routes/template.routes.js
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getTemplates,
  getTemplateById,
} = require('../controllers/template.controller');

// You can add protect if you want only logged-in users to see templates
router.get('/', protect, getTemplates);
router.get('/:id', protect, getTemplateById);

module.exports = router;
