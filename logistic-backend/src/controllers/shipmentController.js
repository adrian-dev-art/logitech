const Shipment = require('../models/Shipment');
const Fleet = require('../models/Fleet');
const { logAction } = require('./activityLogController');

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
exports.getAllShipments = async (req, res, next) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
exports.getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ id: req.params.id });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private (ADMIN, MANAGER, STAFF)
exports.createShipment = async (req, res, next) => {
  try {
    const shipmentData = req.body;

    // If fleet is assigned, update fleet status to 'On Route'
    if (shipmentData.fleet && shipmentData.fleet.id) {
      await Fleet.findOneAndUpdate(
        { id: shipmentData.fleet.id },
        { status: 'On Route' }
      );
    }

    const shipment = await Shipment.create(shipmentData);

    // Log activity
    await logAction(
      req.user.id,
      'CREATE_SHIPMENT',
      `Created shipment ${shipment.id} for ${shipment.customer.name}`,
      req.ip
    );

    res.status(201).json(shipment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private
exports.updateShipmentStatus = async (req, res, next) => {
  try {
    const newStatus = req.body;

    const shipment = await Shipment.findOne({ id: req.params.id });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    const oldStatus = shipment.status;
    shipment.status = newStatus;

    // If shipment is delivered or cancelled, set fleet back to Available
    if ((newStatus === 'Delivered' || newStatus === 'Cancelled') && shipment.fleet && shipment.fleet.id) {
      await Fleet.findOneAndUpdate(
        { id: shipment.fleet.id },
        { status: 'Available' }
      );
    }

    // Set actual delivery date if delivered
    if (newStatus === 'Delivered') {
      shipment.actualDelivery = new Date();
    }

    await shipment.save();

    // Log activity
    await logAction(
      req.user.id,
      'UPDATE_STATUS',
      `Updated shipment ${shipment.id} status from ${oldStatus} to ${newStatus}`,
      req.ip
    );

    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private (ADMIN, MANAGER)
exports.updateShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Log activity
    await logAction(
      req.user.id,
      'UPDATE_SHIPMENT',
      `Updated shipment ${shipment.id} details`,
      req.ip
    );

    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private (ADMIN, MANAGER)
exports.deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ id: req.params.id });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // If fleet was assigned, set it back to Available
    if (shipment.fleet && shipment.fleet.id) {
      await Fleet.findOneAndUpdate(
        { id: shipment.fleet.id },
        { status: 'Available' }
      );
    }

    await Shipment.deleteOne({ id: req.params.id });

    // Log activity
    await logAction(
      req.user.id,
      'DELETE_SHIPMENT',
      `Deleted shipment ${shipment.id}`,
      req.ip
    );

    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
