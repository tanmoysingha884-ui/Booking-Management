const Package = require('../models/Package');

// @desc Get all packages
// @route GET /api/packages
// @access Public
exports.getPackages = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const packages = await Package.find(query).sort({ featured: -1, createdAt: -1 });

    res.json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching packages',
    });
  }
};

// @desc Get single package
// @route GET /api/packages/:id
// @access Public
exports.getPackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create package
// @route POST /api/packages
// @access Private/Admin
exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: pkg,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating package',
    });
  }
};

// @desc Update package
// @route PUT /api/packages/:id
// @access Private/Admin
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({
      success: true,
      message: 'Package updated successfully',
      package: pkg,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating package',
    });
  }
};

// @desc Delete package
// @route DELETE /api/packages/:id
// @access Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting package',
    });
  }
};
