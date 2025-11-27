const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Truck', 'Van', 'Motorcycle', 'Container']
  },
  capacity: {
    type: Number,
    required: true
  },
  driver: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'On Route', 'Maintenance', 'Inactive'],
    default: 'Available'
  },
  lastMaintenance: {
    type: Date
  },
  nextMaintenance: {
    type: Date
  },
  fuelType: {
    type: String,
    enum: ['Diesel', 'Petrol', 'Electric', 'Hybrid'],
    default: 'Diesel'
  },
  year: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fleet', fleetSchema);
