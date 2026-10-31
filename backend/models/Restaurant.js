const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a dish or drink name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a menu category'],
      enum: ['Starters', 'Goan Seafood', 'Main Course', 'Grill & BBQ', 'Cocktails & Beverages', 'Desserts'],
      default: 'Goan Seafood',
    },
    description: {
      type: String,
      required: [true, 'Please add a description of the dish'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please specify price in INR'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    isChefSpecial: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: String,
      enum: ['None', 'Mild', 'Medium', 'Spicy', 'Extra Spicy'],
      default: 'Medium',
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

module.exports = mongoose.model('Restaurant', restaurantSchema);
