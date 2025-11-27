const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    phone: String,
    address: String
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  fleet: {
    id: {
      type: String,
      ref: 'Fleet'
    },
    plateNumber: String,
    driver: String
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shipment', shipmentSchema);
