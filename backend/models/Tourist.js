const mongoose = require('mongoose');

const TouristSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In a real app, hash this with bcrypt!
  country: { type: String, required: true },
  idNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  addressLine1: { type: String },
  city: { type: String },
  interests: [String],
  regions: [String],
  languages: [String],
  role: { type: String, default: 'tourist' }
}, { timestamps: true });

module.exports = mongoose.model('Tourist', TouristSchema);