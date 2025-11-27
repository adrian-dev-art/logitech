const express = require('express');
const router = express.Router();
const {
  getAllFleet,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/fleetController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllFleet)
  .post(authorize('ADMIN', 'MANAGER'), createVehicle);

router.route('/:id')
  .get(getVehicle)
  .put(authorize('ADMIN', 'MANAGER'), updateVehicle)
  .delete(authorize('ADMIN', 'MANAGER'), deleteVehicle);

module.exports = router;
