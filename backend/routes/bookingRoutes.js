const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  checkoutBooking,
  resendRatingMessage,
  submitRating,
  createRazorpayOrder,
  verifyRazorpayPayment,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id/checkout', protect, adminOnly, checkoutBooking);
router.post('/:id/resend-rating', protect, adminOnly, resendRatingMessage);
router.post('/:id/rate', protect, submitRating);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
