const Fleet = require('../models/Fleet');

// @desc    Get all fleet vehicles
// @route   GET /api/fleet
// @access  Private
exports.getAllFleet = async (req, res, next) => {
  try {
    const fleet = await Fleet.find().sort({ createdAt: -1 });
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
    const vehicle = await Fleet.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/fleet/:id
// @access  Private (ADMIN, MANAGER)
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Fleet.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

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
