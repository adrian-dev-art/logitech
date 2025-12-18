const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (ADMIN only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (ADMIN only)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (ADMIN only)
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (ADMIN only)
exports.updateUser = async (req, res, next) => {
  try {
    console.log('Update User Body:', req.body);

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if they are provided
    if (req.body.username && req.body.username !== user.username) {
      user.username = req.body.username;
    }
    if (req.body.email) user.email = req.body.email;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.role) user.role = req.body.role;
    if (req.body.phone) user.phone = req.body.phone;

    // Only update password if provided and not empty
    if (req.body.password && req.body.password.trim() !== '') {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (ADMIN only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available drivers
// @route   GET /api/users/drivers/available
// @access  Private (ADMIN, MANAGER)
exports.getAvailableDrivers = async (req, res, next) => {
  try {
    const Fleet = require('../models/Fleet');

    // Get all users with DRIVER role
    const drivers = await User.find({ role: 'DRIVER' }).select('-password');

    // For each driver, check if they have assigned fleet
    const driversWithAvailability = await Promise.all(
      drivers.map(async (driver) => {
        const assignedFleet = await Fleet.findOne({ driverId: driver._id });

        return {
          _id: driver._id,
          username: driver.username,
          email: driver.email,
          fullName: driver.fullName,
          phone: driver.phone,
          isActive: driver.isActive,
          hasAssignedFleet: !!assignedFleet,
          assignedFleet: assignedFleet ? {
            id: assignedFleet.id,
            plateNumber: assignedFleet.plateNumber,
            type: assignedFleet.type,
            status: assignedFleet.status
          } : null
        };
      })
    );

    res.json(driversWithAvailability);
  } catch (error) {
    next(error);
  }
};

