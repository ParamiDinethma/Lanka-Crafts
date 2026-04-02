const validateBookingBody = (req, res, next) => {
  const { artisanId, craftId, name, email, phone, date, time, groupSize } = req.body;
  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';

  if (!isUpdate) {
    if (!artisanId || !craftId || !name || !email || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields. Please provide artisanId, craftId, name, email, phone, date, and time.'
      });
    }
  }

  // Simple email validation using regex
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.'
      });
    }
  }

  // Simple phone number validation (at least 10 digits)
  if (phone) {
    const phoneRegex = /^\+?[0-9\s\-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format.'
      });
    }
  }

  if (groupSize !== undefined && (isNaN(groupSize) || groupSize < 1)) {
    return res.status(400).json({
      success: false,
      error: 'Group size must be at least 1.'
    });
  }

  next();
};

module.exports = { validateBookingBody };
