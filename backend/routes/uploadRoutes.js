const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../config/cloudinary');

const router = express.Router();

// Fallback upload directory for local development when Cloudinary is not configured
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage keeps file in RAM buffer (required for serverless/Vercel & direct Cloudinary stream)
const storage = multer.memoryStorage();

// File filter: jpg, jpeg, png, webp
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedExts.includes(ext) && (allowedMimes.includes(file.mimetype) || !file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only JPG, JPEG, PNG, and WEBP image files are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});

// GET /api/upload/status - Check whether Cloudinary or Local storage is active
router.get('/status', (req, res) => {
  const configured = isCloudinaryConfigured();
  res.json({
    success: true,
    provider: configured ? 'cloudinary' : 'local',
    cloudinaryConfigured: configured,
    message: configured
      ? 'Cloudinary is configured and ready for production uploads.'
      : 'Using local storage fallback. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env for Cloudinary.',
  });
});

// POST /api/upload - Handle image upload
router.post('/', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file (JPG, JPEG, PNG, WEBP).' });
    }

    try {
      // 1. If Cloudinary credentials are set, upload directly to Cloudinary
      if (isCloudinaryConfigured()) {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'goa_resort',
        });

        return res.json({
          success: true,
          provider: 'cloudinary',
          message: 'Image uploaded to Cloudinary successfully',
          imageUrl: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          size: result.bytes,
          originalName: req.file.originalname,
        });
      }

      // 2. Fallback: Save to local uploads folder (for local development)
      const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `goa-resort-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, req.file.buffer);

      const relativeUrl = `/uploads/${filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${relativeUrl}`;

      return res.json({
        success: true,
        provider: 'local',
        message: 'Image saved locally (Configure Cloudinary in .env for production deployment)',
        imageUrl: fullUrl,
        relativeUrl,
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (uploadError) {
      console.error('Upload processing error:', uploadError);
      return res.status(500).json({
        success: false,
        message: uploadError.message || 'Error uploading image to cloud storage',
      });
    }
  });
});

// DELETE /api/upload - Optional deletion from Cloudinary
router.delete('/', async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'Missing public_id' });
    }

    const result = await deleteFromCloudinary(public_id);
    return res.json({
      success: true,
      message: 'Image removed from Cloudinary',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting image from Cloudinary',
    });
  }
});

module.exports = router;
