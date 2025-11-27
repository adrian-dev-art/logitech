const ActivityLog = require('../models/ActivityLog');

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private (ADMIN, MANAGER)
exports.getLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'username fullName role')
      .sort({ timestamp: -1 })
      .limit(100); // Limit to last 100 logs for performance

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// @desc    Log an action (Helper function)
exports.logAction = async (userId, action, details, ipAddress = '') => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
};
