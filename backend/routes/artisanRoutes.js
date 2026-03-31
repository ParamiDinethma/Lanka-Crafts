
const express = require('express');
const router = express.Router();
const Artisan = require('../models/Artisan');



// POST route for Artist Registration
router.post('/register', async (req, res) => {
  try {
    const newArtisan = new Artisan(req.body);
    await newArtisan.save();
    res.status(201).json({ message: 'Artisan registered successfully!', data: newArtisan });
  } catch (error) {
    res.status(400).json({ message: 'Error registering artisan', error: error.message });
  }
});

// GET artisans by craft
router.get('/artisans', async (req, res) => {
  const { craftId } = req.query;

  try {
    const artisans = await Artisan.find({ craftId: craftId });
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
