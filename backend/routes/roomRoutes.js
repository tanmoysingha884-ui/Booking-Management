const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getAllRooms)
  .post(protect, adminOnly, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, adminOnly, updateRoom)
  .delete(protect, adminOnly, deleteRoom);

module.exports = router;
