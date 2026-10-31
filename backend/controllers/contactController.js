const Contact = require('../models/Contact');

// @desc Submit contact message / inquiry
// @route POST /api/contact
// @access Public
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message',
      });
    }

    const inquiry = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been sent to our concierge desk. We will respond shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting message',
    });
  }
};

// @desc Get all contact inquiries
// @route GET /api/contact
// @access Private/Admin
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching messages',
    });
  }
};

// @desc Update inquiry status
// @route PUT /api/contact/:id
// @access Private/Admin
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Status updated',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating message status',
    });
  }
};
