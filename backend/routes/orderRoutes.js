const express = require("express");
const Order = require("./../models/Order");
const { protect } = require("./../middleware/authMiddleware");

const router = express.Router();

// Get Orders API
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Orders By ID API
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
