const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const { validateBookingBody } = require('../middlewares/validateBooking');
const { checkDoubleBooking } = require('../middlewares/checkDoubleBooking');

// --------------------
// BOOKING ROUTES
// --------------------

// 1️ Create booking - validation, then check double booking
router.post('/', validateBookingBody, checkDoubleBooking, bookingController.createBooking);

// 2️ Get all bookings - let's say only admins can get ALL bookings, or could just be verifyToken. We'll use verifyToken for now.
router.get('/', verifyToken, bookingController.getAllBookings);

// 3️ Get bookings by email - protected by auth
router.get('/user/:email', verifyToken, bookingController.getBookingsByEmail);

// 4️ Update booking - protected by auth
router.put('/:id', verifyToken, validateBookingBody, checkDoubleBooking, bookingController.updateBooking);

// 5️ Delete booking - protected by auth
router.delete('/:id', verifyToken, bookingController.deleteBooking);

module.exports = router;