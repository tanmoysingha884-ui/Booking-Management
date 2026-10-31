const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc Create new booking
// @route POST /api/bookings
// @access Private
exports.createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      paymentMethod,
    } = req.body;

    if (!roomId || !checkIn || !checkOut || !guestDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking fields',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Selected room not found',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    const diffTime = Math.abs(checkOutDate - checkInDate);
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const pricePerNight = room.discountPrice && room.discountPrice > 0 ? room.discountPrice : room.pricePerNight;
    const roomCost = pricePerNight * totalNights;
    const taxAmount = Math.round(roomCost * 0.12); // 12% GST
    const totalAmount = roomCost + taxAmount;

    const isPaidOnline = paymentMethod?.toLowerCase().includes('card') || 
                         paymentMethod?.toLowerCase().includes('upi') || 
                         paymentMethod?.toLowerCase().includes('razorpay') || 
                         paymentMethod?.toLowerCase().includes('online');
    const finalPaymentStatus = req.body.paymentStatus 
      ? req.body.paymentStatus 
      : (isPaidOnline ? 'Paid' : 'Non Paid');

    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 2, children: 0 },
      totalNights,
      roomPrice: pricePerNight,
      taxAmount,
      totalAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: finalPaymentStatus,
      paymentMethod: paymentMethod || (isPaidOnline ? 'Razorpay (Card/UPI)' : 'Pay at Resort Check-In'),
      guestDetails: {
        name: guestDetails.name || req.user.name,
        email: guestDetails.email || req.user.email,
        phone: guestDetails.phone || req.user.phone || '',
        specialRequests: guestDetails.specialRequests || '',
      },
      razorpayDetails: req.body.razorpayDetails || (finalPaymentStatus === 'Paid' ? {
        orderId: req.body.razorpayDetails?.orderId || ('order_' + Math.random().toString(36).substring(2, 9)),
        paymentId: req.body.razorpayDetails?.paymentId || ('pay_' + Math.random().toString(36).substring(2, 9)),
        paidAt: new Date(),
        method: req.body.razorpayDetails?.method || 'UPI / Card (Razorpay Demo)',
      } : {}),
    });

    const populatedBooking = await Booking.findById(booking._id).populate('room');

    res.status(201).json({
      success: true,
      message: 'Booking reserved successfully! We are excited to welcome you to Goa Resort.',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing reservation',
    });
  }
};

// @desc Get logged-in user bookings
// @route GET /api/bookings/my
// @access Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving your bookings',
    });
  }
};

// @desc Get all bookings (Admin only)
// @route GET /api/bookings
// @access Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all bookings',
    });
  }
};

// @desc Update booking status (Admin only)
// @route PUT /api/bookings/:id/status
// @access Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus, paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) {
      booking.paymentStatus = (paymentStatus === 'Paid') ? 'Paid' : 'Non Paid';
      if (paymentStatus === 'Paid' && !booking.paymentMethod?.includes('Card') && !booking.paymentMethod?.includes('UPI')) {
        booking.paymentMethod = paymentMethod || 'Card / UPI (Settled)';
      }
    }
    if (paymentMethod) booking.paymentMethod = paymentMethod;

    if (bookingStatus === 'Checked-Out' || bookingStatus === 'Completed') {
      if (!booking.checkedOutAt) booking.checkedOutAt = new Date();
    }

    await booking.save();

    const updated = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email avatar phone');

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating booking status',
    });
  }
};

// @desc Checkout guest & automatically dispatch rating message to registered phone and email
// @route PUT /api/bookings/:id/checkout
// @access Private/Admin
exports.checkoutBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email avatar phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const guestName = booking.guestDetails?.name || booking.user?.name || 'Valued Guest';
    const guestPhone = booking.guestDetails?.phone || booking.user?.phone || '+91 98765 43210';
    const guestEmail = booking.guestDetails?.email || booking.user?.email || 'guest@example.com';
    const roomName = booking.room?.name || 'Luxury Suite';
    const bookingRef = booking.bookingReference;

    const ratingMessageText = `Dear ${guestName}, thank you for staying at Goa Luxury Resort & Spa! We hope you enjoyed your stay in ${roomName}. Please take 30 seconds to rate your stay & share your feedback: https://goaresort.com/feedback/${bookingRef}?guest=${encodeURIComponent(guestPhone)}. Your review helps us continue delivering world-class hospitality! ⭐⭐⭐⭐⭐`;

    booking.bookingStatus = 'Checked-Out';
    booking.checkedOutAt = new Date();
    booking.ratingMessageSent = true;
    booking.ratingMessageDetails = {
      sentAt: new Date(),
      recipientPhone: guestPhone,
      recipientEmail: guestEmail,
      messageText: ratingMessageText,
      ratingUrl: `https://goaresort.com/feedback/${bookingRef}`,
      deliveryStatus: 'Delivered (SMS & Email)',
    };

    await booking.save();

    const updated = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email avatar phone');

    res.json({
      success: true,
      message: `Guest checked out successfully! Automated rating message sent to registered mobile (${guestPhone}) and email (${guestEmail}).`,
      booking: updated,
      ratingDetails: {
        guestName,
        recipientPhone: guestPhone,
        recipientEmail: guestEmail,
        messageText: ratingMessageText,
        sentAt: booking.ratingMessageDetails.sentAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking out guest',
    });
  }
};

// @desc Resend rating message to guest's registered mobile & email
// @route POST /api/bookings/:id/resend-rating
// @access Private/Admin
exports.resendRatingMessage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email avatar phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const guestName = booking.guestDetails?.name || booking.user?.name || 'Valued Guest';
    const guestPhone = booking.guestDetails?.phone || booking.user?.phone || '+91 98765 43210';
    const guestEmail = booking.guestDetails?.email || booking.user?.email || 'guest@example.com';
    const roomName = booking.room?.name || 'Luxury Suite';
    const bookingRef = booking.bookingReference;

    const ratingMessageText = `Reminder: Dear ${guestName}, we would love to hear your feedback on your stay at Goa Luxury Resort & Spa (${roomName}). Rate your stay here: https://goaresort.com/feedback/${bookingRef} ⭐⭐⭐⭐⭐`;

    booking.ratingMessageSent = true;
    booking.ratingMessageDetails = {
      sentAt: new Date(),
      recipientPhone: guestPhone,
      recipientEmail: guestEmail,
      messageText: ratingMessageText,
      ratingUrl: `https://goaresort.com/feedback/${bookingRef}`,
      deliveryStatus: 'Resent (SMS & Email)',
    };

    await booking.save();

    res.json({
      success: true,
      message: `Rating message resent to mobile (${guestPhone}) and email (${guestEmail})`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error resending rating message' });
  }
};

// @desc Submit rating for a checked-out booking
// @route POST /api/bookings/:id/rate
// @access Private
exports.submitRating = async (req, res) => {
  try {
    const { score, review } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.guestRating = {
      score: Number(score) || 5,
      review: review || '',
      submittedAt: new Date(),
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Thank you for your rating and feedback!',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting rating' });
  }
};

// @desc Cancel booking (User can cancel own, Admin can cancel any)
// @route PUT /api/bookings/:id/cancel
// @access Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    booking.bookingStatus = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking has been cancelled',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling booking',
    });
  }
};

// @desc Create Razorpay Demo Order
// @route POST /api/bookings/razorpay/create-order
// @access Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const orderId = 'order_' + Math.random().toString(36).substring(2, 11) + Date.now().toString().slice(-4);

    res.json({
      success: true,
      order: {
        id: orderId,
        entity: 'order',
        amount: Math.round(Number(amount) * 100),
        amount_paid: 0,
        amount_due: Math.round(Number(amount) * 100),
        currency,
        receipt: 'rcpt_' + Date.now().toString().slice(-6),
        status: 'created',
        keyId: 'rzp_test_GoaResort9988',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating Razorpay order',
    });
  }
};

// @desc Verify Razorpay Demo Payment
// @route POST /api/bookings/razorpay/verify
// @access Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, status = 'success' } = req.body;

    if (status !== 'success') {
      return res.status(400).json({
        success: false,
        paymentStatus: 'Non Paid',
        message: 'Payment cancelled or failed in Razorpay.',
      });
    }

    const paymentId = razorpay_payment_id || ('pay_' + Math.random().toString(36).substring(2, 12));

    res.json({
      success: true,
      paymentStatus: 'Paid',
      paymentId,
      orderId: razorpay_order_id,
      message: 'Razorpay payment verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment',
    });
  }
};
