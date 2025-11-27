const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllCustomers)
  .post(authorize('ADMIN', 'MANAGER', 'STAFF'), createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(authorize('ADMIN', 'MANAGER', 'STAFF'), updateCustomer)
  .delete(authorize('ADMIN', 'MANAGER'), deleteCustomer);

module.exports = router;
