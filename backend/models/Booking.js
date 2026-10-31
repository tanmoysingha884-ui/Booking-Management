const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    guests: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    totalNights: {
      type: Number,
      required: true,
      min: 1,
    },
    roomPrice: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed', 'Checked-Out'],
      default: 'Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Non Paid', 'Non Pay', 'Pending', 'Failed', 'Refunded'],
      default: 'Non Paid',
    },
    paymentMethod: {
      type: String,
      default: 'Card Payment (Online)',
    },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String, default: '' },
    },
    bookingReference: {
      type: String,
      unique: true,
      default: () => 'GOA-' + Math.floor(100000 + Math.random() * 900000),
    },
    checkedOutAt: {
      type: Date,
    },
    ratingMessageSent: {
      type: Boolean,
      default: false,
    },
    ratingMessageDetails: {
      sentAt: { type: Date },
      recipientPhone: { type: String },
      recipientEmail: { type: String },
      messageText: { type: String },
      ratingUrl: { type: String },
      deliveryStatus: { type: String, default: 'Delivered (SMS & Email)' },
    },
    guestRating: {
      score: { type: Number, min: 1, max: 5 },
      review: { type: String },
      submittedAt: { type: Date },
    },
    razorpayDetails: {
      orderId: { type: String, default: '' },
      paymentId: { type: String, default: '' },
      signature: { type: String, default: '' },
      method: { type: String, default: '' },
      paidAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
