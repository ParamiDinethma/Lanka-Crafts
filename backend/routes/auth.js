const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const Tourist = require('../models/Tourist');

/**
 * POST /api/tourist/register
 * Called from the frontend after Firebase creates the user account.
 * Expects the Firebase ID token in the Authorization header
 * plus all profile fields from the 3-step form in the body.
 */
router.post('/register', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required in Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired Firebase token.' });
  }

  const { uid, email: firebaseEmail } = decoded;

  // Check if tourist profile already exists
  const existing = await Tourist.findOne({ firebaseUid: uid });
  if (existing) {
    return res.status(409).json({ error: 'Tourist profile already exists for this account.' });
  }

  const {
    fullName,
    callingName,
    email,
    country,
    preferredLanguages,
    idNumber,
    dateOfBirth,
    address,
    interests,
    preferredRegions,
  } = req.body;

  if (!fullName || !country) {
    return res.status(400).json({ error: 'fullName and country are required.' });
  }

  const tourist = await Tourist.create({
    firebaseUid: uid,
    fullName,
    callingName,
    email: email || firebaseEmail,
    country,
    preferredLanguages: preferredLanguages || [],
    idNumber: idNumber || '',
    dateOfBirth: dateOfBirth || undefined,
    address: address || {},
    interests: interests || [],
    preferredRegions: preferredRegions || [],
  });

  res.status(201).json({
    message: 'Tourist profile created successfully.',
    tourist: {
      id: tourist._id,
      fullName: tourist.fullName,
      callingName: tourist.callingName,
      email: tourist.email,
      country: tourist.country,
      interests: tourist.interests,
      initials: tourist.initials,
    },
  });
});

/**
 * POST /api/tourist/login
 * Called after Firebase client-side sign-in to sync profile back.
 * Verifies the Firebase ID token and returns the MongoDB profile.
 */
router.post('/login', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired Firebase token.' });
  }

  const { uid } = decoded;

  const tourist = await Tourist.findOne({ firebaseUid: uid });
  if (!tourist) {
    return res.status(404).json({
      error: 'Tourist profile not found. Please complete registration.',
    });
  }

  res.json({
    message: 'Logged in successfully.',
    tourist: {
      id: tourist._id,
      fullName: tourist.fullName,
      callingName: tourist.callingName,
      email: tourist.email,
      country: tourist.country,
      interests: tourist.interests,
      preferredLanguages: tourist.preferredLanguages,
      preferredRegions: tourist.preferredRegions,
      initials: tourist.initials,
    },
  });
});

module.exports = router;
