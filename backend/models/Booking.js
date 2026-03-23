const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true,
    },
    workshopName: {
      type: String,
      required: true,
    },
    artisan: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled'],
      default: 'Pending',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
