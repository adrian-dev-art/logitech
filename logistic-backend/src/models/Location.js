const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  cityName: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['Warehouse', 'Distribution Center', 'Branch', 'Customer Location'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  capacity: {
    type: Number,
    default: 0
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  manager: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
