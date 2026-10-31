const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the image'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Beach', 'Suites', 'Dining', 'Spa & Pool', 'Sunset & Vibe'],
      default: 'Beach',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide image URL'],
    },
    description: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);
