const mongoose = require('mongoose');

const locationSuggestionSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['food', 'tourist', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LocationSuggestion', locationSuggestionSchema);
