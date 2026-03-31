const express = require('express');
const router = express.Router();
const Tourist = require('../models/Tourist');



// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    const existingTourist = await Tourist.findOne({ email });
    if (existingTourist) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    const newTourist = new Tourist(req.body);
    await newTourist.save();

    res.status(201).json({ 
      message: "Registration successful!",
      user: { email: newTourist.email, name: newTourist.fullName }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (tourist.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        email: tourist.email,
        name: tourist.fullName
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;