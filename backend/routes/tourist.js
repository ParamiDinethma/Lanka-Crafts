const express = require('express');
const router = express.Router();
const Tourist = require('../models/Tourist');
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const { verifyFirebaseToken } = require('../middleware/auth');

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
router.patch('/profile', verifyFirebaseToken, async (req, res) => {
  const allowedFields = [
    'fullName',
    'country',
    'preferredLanguages',
    'idNumber',
    'dateOfBirth',
    'address',
    'interests',
    'preferredRegions',
    'savedWorkshops',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided to update.' });
  }

  const updated = await Tourist.findByIdAndUpdate(
    req.tourist._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.json({ message: 'Profile updated.', tourist: updated });
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
