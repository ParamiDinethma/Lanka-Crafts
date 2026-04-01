const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');

// --------------------
// BOOKING ROUTES
// --------------------

// 1️ Create booking
router.post('/', bookingController.createBooking);

// 2️ Get all bookings
router.get('/', bookingController.getAllBookings);

// 3️ Get bookings by email
router.get('/user/:email', bookingController.getBookingsByEmail);

// 4️ Update booking
router.put('/:id', bookingController.updateBooking);

// 5️ Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;