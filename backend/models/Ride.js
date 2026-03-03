const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Set when driver accepts
  },
  pickup: {
    type: String, // Kept simple as String per guidelines, could upgrade to GeoJSON later
    required: true
  },
  destination: {
    type: String, 
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'completed', 'cancelled'],
    default: 'requested'
  },
  rideType: {
    type: String,
    enum: ['economy', 'premium', 'shared'],
    default: 'economy'
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', RideSchema);
