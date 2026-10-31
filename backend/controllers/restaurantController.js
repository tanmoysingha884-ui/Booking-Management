const Restaurant = require('../models/Restaurant');

// @desc Get all restaurant menu items
// @route GET /api/restaurant
// @access Public
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search, isVeg } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isVeg !== undefined && isVeg !== '') {
      query.isVeg = isVeg === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Restaurant.find(query).sort({ isChefSpecial: -1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching menu items',
    });
  }
};

// @desc Get single menu item
// @route GET /api/restaurant/:id
// @access Public
exports.getMenuItem = async (req, res) => {
  try {
    const item = await Restaurant.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create menu item
// @route POST /api/restaurant
// @access Private/Admin
exports.createMenuItem = async (req, res) => {
  try {
    const item = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating menu item',
    });
  }
};

// @desc Update menu item
// @route PUT /api/restaurant/:id
// @access Private/Admin
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating menu item',
    });
  }
};

// @desc Delete menu item
// @route DELETE /api/restaurant/:id
// @access Private/Admin
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await Restaurant.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting menu item',
    });
  }
};
