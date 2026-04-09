require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const bookingRoutes = require('./routes/bookingRoutes');
const touristRoutes = require('./routes/touristRoutes');
const Artisan = require('./models/Artisan');
const artisanRoutes = require('./routes/artisanRoutes');

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// Database Connection
// --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Booking System)"))
  .catch(err => console.error("❌ Connection Error:", err));


// --------------------
// Booking Routes
// --------------------
app.use('/api/bookings', bookingRoutes);

// --------------------
// Tourist Routes
// --------------------
app.use('/api/tourists', touristRoutes);




app.use('/api/artisans', artisanRoutes);

app.get('/api/artisans', async (req, res) => {
  try {
    const { craftId } = req.query;

    const artisans = await Artisan.find({ craftId });

    res.json(artisans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artisans" });
  }
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Booking Backend running on http://localhost:${PORT}`)
);