const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitInquiry);
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id', protect, adminOnly, updateInquiryStatus);

module.exports = router;
