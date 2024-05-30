const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    origin_address: {
      type: String,
      required: true,
    },
    origin_place_id: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    route_last_place_id: {
      type: String,
      required: true,
    },
    route_data: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);