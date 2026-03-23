const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { verifyFirebaseToken } = require('../middleware/auth');

/**
 * GET /api/tourist/bookings
 * Returns all bookings for the authenticated tourist,
 * split into upcoming and past.
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  const touristId = req.tourist._id;
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    Booking.find({ tourist: touristId, date: { $gte: now } })
      .sort({ date: 1 })
      .lean(),
    Booking.find({ tourist: touristId, date: { $lt: now } })
      .sort({ date: -1 })
      .lean(),
  ]);

  res.json({ upcoming, past });
});

/**
 * POST /api/tourist/bookings
 * Create a new booking for the authenticated tourist.
 * (Used when the BookWorkshop page is linked to a tourist account.)
 */
router.post('/', verifyFirebaseToken, async (req, res) => {
  const { workshopName, artisan, location, date, status, imageUrl, price } = req.body;

  if (!workshopName || !date) {
    return res.status(400).json({ error: 'workshopName and date are required.' });
  }

  const booking = await Booking.create({
    tourist: req.tourist._id,
    workshopName,
    artisan: artisan || '',
    location: location || '',
    date: new Date(date),
    status: status || 'Pending',
    imageUrl: imageUrl || '',
    price: price || '',
  });

  res.status(201).json({ message: 'Booking created.', booking });
});

/**
 * PATCH /api/tourist/bookings/:id/cancel
 * Cancel a booking (only owns bookings can be cancelled).
 */
router.patch('/:id/cancel', verifyFirebaseToken, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });

  if (!booking.tourist.equals(req.tourist._id)) {
    return res.status(403).json({ error: 'You can only cancel your own bookings.' });
  }

  booking.status = 'Cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled.', booking });
});

module.exports = router;
