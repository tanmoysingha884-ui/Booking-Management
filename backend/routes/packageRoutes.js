const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getPackages)
  .post(protect, adminOnly, createPackage);

router.route('/:id')
  .get(getPackage)
  .put(protect, adminOnly, updatePackage)
  .delete(protect, adminOnly, deletePackage);

module.exports = router;
