const Gallery = require('../models/Gallery');

// @desc Get gallery items
// @route GET /api/gallery
// @access Public
exports.getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching gallery items',
    });
  }
};

// @desc Add gallery item
// @route POST /api/gallery
// @access Private/Admin
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, category, imageUrl, description, featured } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide image title and URL',
      });
    }

    const item = await Gallery.create({
      title,
      category: category || 'Beach',
      imageUrl,
      description: description || '',
      featured: !!featured,
    });

    res.status(201).json({
      success: true,
      message: 'Photo added to gallery',
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating gallery item',
    });
  }
};

// @desc Delete gallery item
// @route DELETE /api/gallery/:id
// @access Private/Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Photo removed from gallery',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting gallery photo',
    });
  }
};
