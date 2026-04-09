const Booking = require('../models/workshopBooking');

const checkDoubleBooking = async (req, res, next) => {
  try {
    const { artisanId, date, time } = req.body;

    if (!artisanId || !date || !time) {
      // Allow validateBooking to handle missing fields if it's placed after this, 
      // or just proceed and let other validation handle it.
      return next();
    }

    // Check if a booking already exists for this artisan at the given date and time
    // Exclude the current booking being updated if an ID is provided in params
    const query = {
      artisanId,
      bookingDate: date,
      bookingTime: time,
      status: { $in: ['pending', 'confirmed'] }
    };

    if (req.params.id) {
      query._id = { $ne: req.params.id };
    }

    const existingBooking = await Booking.findOne(query);

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: 'Double booking detected: The artisan is already booked for this date and time.'
      });
    }

    next();
  } catch (err) {
    console.error("Double Booking Check Error:", err);
    res.status(500).json({
      success: false,
      error: 'Failed to verify booking availability.'
    });
  }
};

module.exports = { checkDoubleBooking };
