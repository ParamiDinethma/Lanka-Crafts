const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// --------------------
// BOOKING ROUTES
// --------------------

// 1️ Create a new booking
router.post('/', async (req, res) => {
  
  try {
    const { 
      artisanId,
      craftId, 
      name, 
      email, 
      phone, 
      date, 
      time, 
      groupSize 
    } = req.body;

    const newBooking = new Booking({
  artisanId,
  craftId,
  customerName: name,
  customerEmail: email,
  customerPhone: phone,
  bookingDate: date,
  bookingTime: time,
  groupSize
});

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking saved successfully!",
      data: savedBooking
    });

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to save booking"
    });
  }
});

// 2️ Get all bookings (admin/testing)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

// 3️ Get bookings by user email (FOR MyBookings.tsx)
router.get('/user/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerEmail: req.params.email
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch user bookings" });
  }
});

// 4️ Update booking
router.put('/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// 5️ Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

module.exports = router;
