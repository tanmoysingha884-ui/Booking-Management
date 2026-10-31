const Room = require('../models/Room');

// @desc Get all rooms with optional filters
// @route GET /api/rooms
// @access Public
exports.getAllRooms = async (req, res) => {
  try {
    const { roomType, minPrice, maxPrice, guests, featured, search } = req.query;
    let query = {};

    if (roomType && roomType !== 'All') {
      query.roomType = roomType;
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (guests) {
      query['capacity.maxGuests'] = { $gte: Number(guests) };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } },
      ];
    }

    const rooms = await Room.find(query).sort({ pricePerNight: 1 });
    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching rooms',
    });
  }
};

// @desc Get single room
// @route GET /api/rooms/:id
// @access Public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }
    res.json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving room details',
    });
  }
};

// @desc Create a room (Admin only)
// @route POST /api/rooms
// @access Private/Admin
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating room',
    });
  }
};

// @desc Update room (Admin only)
// @route PUT /api/rooms/:id
// @access Private/Admin
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating room',
    });
  }
};

// @desc Delete room (Admin only)
// @route DELETE /api/rooms/:id
// @access Private/Admin
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Room removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting room',
    });
  }
};
