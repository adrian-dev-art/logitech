const express = require('express');
const router = express.Router();
const {
  getAllShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  updateShipment,
  deleteShipment
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllShipments)
  .post(authorize('ADMIN', 'MANAGER', 'STAFF'), createShipment);

router.route('/:id')
  .get(getShipment)
  .put(authorize('ADMIN', 'MANAGER'), updateShipment)
  .delete(authorize('ADMIN', 'MANAGER'), deleteShipment);

router.put('/:id/status', updateShipmentStatus);

module.exports = router;
