const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, 'Please specify room type'],
      enum: ['Deluxe Room', 'Super Deluxe', 'Ocean Suite', 'Royal Villa', 'Beachfront Cottage'],
      default: 'Deluxe Room',
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    capacity: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 1, min: 0 },
      maxGuests: { type: Number, default: 3, min: 1 },
    },
    bedType: {
      type: String,
      default: 'King Bed',
    },
    sizeSqFt: {
      type: Number,
      default: 450,
    },
    view: {
      type: String,
      default: 'Arabian Sea View',
    },
    amenities: {
      type: [String],
      default: [
        'Free High-speed Wi-Fi',
        'Air Conditioning',
        'Ocean View Balcony',
        'King Size Bed',
        '24/7 Room Service',
        'Complimentary Breakfast',
      ],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one room image'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 18,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
