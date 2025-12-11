// server/src/routes/analytics.routes.js
const router = require('express').Router();
const { recordView, getOverview } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');

// public endpoint to record a view
router.post('/forms/:formId/view', recordView);

// authenticated overview for current user
router.get('/overview', protect, getOverview);

module.exports = router;