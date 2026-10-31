const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/restaurantController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getMenuItems)
  .post(protect, adminOnly, createMenuItem);

router.route('/:id')
  .get(getMenuItem)
  .put(protect, adminOnly, updateMenuItem)
  .delete(protect, adminOnly, deleteMenuItem);

module.exports = router;
