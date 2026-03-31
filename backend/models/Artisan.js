const mongoose = require('mongoose');

const ArtisanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  craftId: { type: String, required: true }, // e.g., 'pottery', 'weaving'
  location: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  image: { type: String }, // Hex color code or URL
  isRegistered: { type: Boolean, default: true }
});

module.exports = mongoose.model('Artisan', ArtisanSchema);