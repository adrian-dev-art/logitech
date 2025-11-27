const express = require('express');
const router = express.Router();
const {
  getAllLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllLocations)
  .post(authorize('ADMIN', 'MANAGER'), createLocation);

router.route('/:id')
  .get(getLocation)
  .put(authorize('ADMIN', 'MANAGER'), updateLocation)
  .delete(authorize('ADMIN', 'MANAGER'), deleteLocation);

module.exports = router;
