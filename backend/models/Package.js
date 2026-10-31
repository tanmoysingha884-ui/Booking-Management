const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a package title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a package category'],
      enum: ['Honeymoon', 'Family Getaway', 'Wellness & Spa', 'Beach Adventure', 'Weekend Escape'],
      default: 'Honeymoon',
    },
    duration: {
      type: String,
      required: [true, 'Please specify duration (e.g. 4 Days / 3 Nights)'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please specify package base price in INR'],
    },
    discountPrice: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, 'Please add a package description'],
      trim: true,
    },
    inclusions: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.9,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);
