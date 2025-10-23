const express = require("express");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("./../middleware/authMiddleware");

const router = express.Router();

// Utility function to create JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "40h" });
};

// =============================
// REGISTER API
// =============================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    // ✅ Generate JWT (simplified structure)
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// =============================
// LOGIN API
// =============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Incorrect email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // ✅ Generate JWT (same simplified structure)
    const token = generateToken(user._id, user.role);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// =============================
// GET USER PROFILE (Protected)
// =============================
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
