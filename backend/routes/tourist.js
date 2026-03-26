const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const Tourist = require('../models/Tourist');
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const cloudinary = require('../config/cloudinary');
const { verifyFirebaseToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });
const jsonLarge = express.json({ limit: '5mb' });

/**
 * GET /api/tourist/profile
 * Returns the authenticated tourist's full profile.
 */
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  res.json({ tourist: req.tourist });
});

/**
 * PATCH /api/tourist/profile
 * Update allowed fields of the tourist profile.
 */
router.patch('/profile', verifyFirebaseToken, jsonLarge, async (req, res) => {
  try {
    const updates = { ...req.body };

    const updated = await Tourist.findByIdAndUpdate(
      req.tourist._id,
      { $set: updates },
      { new: true }
    );

    res.json({ message: 'Profile updated.', tourist: updated });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

/**
 * Extract public_id from Cloudinary URL
 */
const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  
  let startIndex = uploadIndex + 1;
  if (parts[startIndex].match(/^v\d+$/)) {
    startIndex += 1;
  }
  
  const publicIdWithExt = parts.slice(startIndex).join('/');
  return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
};

/**
 * POST /api/tourist/profile-picture
 * Upload a profile picture to Cloudinary and update the tourist profile.
 */
router.post('/profile-picture', verifyFirebaseToken, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'lankacrafts/users' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Image upload failed' });
        }

        // Delete old image from Cloudinary if it exists
        if (req.tourist.profilePicUrl) {
          const oldPublicId = getCloudinaryPublicId(req.tourist.profilePicUrl);
          if (oldPublicId) {
            try {
              await cloudinary.uploader.destroy(oldPublicId);
            } catch (delErr) {
              console.error('Failed to delete old image from Cloudinary:', delErr);
            }
          }
        }

        const updated = await Tourist.findByIdAndUpdate(
          req.tourist._id,
          { $set: { profilePicUrl: result.secure_url } },
          { new: true }
        );

        res.json({ message: 'Profile picture updated.', profilePicUrl: result.secure_url, tourist: updated });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Profile picture route error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

/**
 * GET /api/tourist/stats
 * Returns dashboard stats: workshops attended, blogs posted,
 * reviews given, upcoming bookings count.
 */
router.get('/stats', verifyFirebaseToken, async (req, res) => {
  const touristId = req.tourist._id;

  const [blogsPosted, upcomingBookings] = await Promise.all([
    Blog.countDocuments({ author: touristId, status: 'published' }),
    Booking.countDocuments({
      tourist: touristId,
      status: { $in: ['Confirmed', 'Pending'] },
      date: { $gte: new Date() },
    }),
  ]);

  res.json({
    stats: {
      workshopsAttended: req.tourist.workshopsAttended,
      blogsPosted,
      reviewsGiven: req.tourist.reviewsGiven,
      upcomingBookings,
    },
  });
});

module.exports = router;
