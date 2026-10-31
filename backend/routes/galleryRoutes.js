const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getGalleryItems);
router.post('/', protect, adminOnly, createGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
