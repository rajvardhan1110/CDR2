const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const Test = require('../models/Test');
const router = express.Router();

// Only admin (admin@gmail.com) can access these
function adminOnly(req, res, next) {
  if (!req.user || req.user.email !== 'admin@gmail.com') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// GET users with basic analytics
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find();
    const out = [];
    for (const u of users) {
      const tests = await Test.find({ userId: u._id });
      const totalTests = tests.length;
      const avgScore = totalTests ? Math.round((tests.reduce((s, t) => s + (t.score || 0), 0) / totalTests) * 10) / 10 : 0;
      out.push({ _id: u._id, name: u.name, email: u.email, totalTests, avgScore });
    }
    res.json({ users: out });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user info (include patient health fields)
router.get('/users/:userId', authMiddleware, adminOnly, async (req, res) => {
  try {
    // include medical/patient fields so admin UI can display them
    const u = await User.findById(req.params.userId).select('name email dob age bloodGroup gender otherHealthIssues createdAt');
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json({ user: {
      _id: u._id,
      name: u.name,
      email: u.email,
      dob: u.dob,
      age: u.age,
      bloodGroup: u.bloodGroup,
      gender: u.gender,
      otherHealthIssues: u.otherHealthIssues,
      createdAt: u.createdAt,
    } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tests for a user
router.get('/users/:userId/tests', authMiddleware, adminOnly, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET specific test for a user
router.get('/users/:userId/tests/:testId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json({ test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
