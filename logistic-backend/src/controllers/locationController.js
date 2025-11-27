const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
exports.getAllLocations = async (req, res, next) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private
exports.getLocation = async (req, res, next) => {
  try {
    const location = await Location.findOne({ id: req.params.id });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (ADMIN, MANAGER)
exports.createLocation = async (req, res, next) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (ADMIN, MANAGER)
exports.updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (ADMIN, MANAGER)
exports.deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findOne({ id: req.params.id });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await Location.deleteOne({ id: req.params.id });
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    next(error);
  }
};
