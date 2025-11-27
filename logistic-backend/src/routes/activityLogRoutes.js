const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/activityLogController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('ADMIN', 'MANAGER'), getLogs);

module.exports = router;
