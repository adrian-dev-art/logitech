const Fleet = require('../models/Fleet');

// @desc    Get all fleet vehicles
// @route   GET /api/fleet
// @access  Private
exports.getAllFleet = async (req, res, next) => {
  try {
    let query = {};

    // If user is a driver, only show vehicles assigned to them
    if (req.user.role === 'DRIVER') {
      query.driverId = req.user._id;
    }

    const fleet = await Fleet.find(query).sort({ createdAt: -1 });
    res.json(fleet);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle
// @route   GET /api/fleet/:id
// @access  Private
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Fleet.findOne({ id: req.params.id });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/fleet
// @access  Private (ADMIN, MANAGER)
exports.createVehicle = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const vehicleData = req.body;

    // If driver name is provided, find the driver user and set driverId
    if (vehicleData.driver) {
      const driverUser = await User.findOne({
        fullName: vehicleData.driver,
        role: 'DRIVER'
      });

      if (driverUser) {
        vehicleData.driverId = driverUser._id;
      }
    }

    const vehicle = await Fleet.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/fleet/:id
// @access  Private (ADMIN, MANAGER, DRIVER)
exports.updateVehicle = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const vehicle = await Fleet.findOne({ id: req.params.id });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // If user is a driver, verify they own this vehicle
    if (req.user.role === 'DRIVER') {
      if (!vehicle.driverId || vehicle.driverId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'You are not authorized to update this vehicle'
        });
      }
    }

    // If driver name is being updated, find and set driverId
    if (req.body.driver) {
      const driverUser = await User.findOne({
        fullName: req.body.driver,
        role: 'DRIVER'
      });

      if (driverUser) {
        req.body.driverId = driverUser._id;
      }
    }

    // Update vehicle
    Object.assign(vehicle, req.body);
    await vehicle.save();

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/fleet/:id
// @access  Private (ADMIN, MANAGER)
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Fleet.findOne({ id: req.params.id });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await Fleet.deleteOne({ id: req.params.id });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
};
