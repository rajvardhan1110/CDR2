const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();
const SALT_ROUNDS = 10;

// SIGNUP
// Accepts optional patient demographic/medical fields and stores them on the user record.
router.post("/signup", async (req, res) => {
  const { name, email, password, dob, age, bloodGroup, gender, otherHealthIssues } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email, and password required" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash, dob, age, bloodGroup, gender, otherHealthIssues });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      SECRET,
      { expiresIn: "7d" }
    );

    // return user with new fields for frontend convenience
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, dob: user.dob, age: user.age, bloodGroup: user.bloodGroup, gender: user.gender, otherHealthIssues: user.otherHealthIssues } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SIGNIN
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET current user (verify token)
router.get("/me", require("../middleware/auth").authMiddleware, async (req, res) => {
  try {
    // Fetch fresh user record to return full profile (including patient details)
    const u = await User.findById(req.user.id).select('-passwordHash');
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json({ user: u });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
