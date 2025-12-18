const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAvailableDrivers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Available drivers route (ADMIN and MANAGER can access)
router.get('/drivers/available', authorize('ADMIN', 'MANAGER'), getAvailableDrivers);

// Other routes require ADMIN role only
router.use(authorize('ADMIN'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
