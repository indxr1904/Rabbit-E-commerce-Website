const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoute = require("./routes/subscribeRoute");
const adminRoutes = require("./routes/adminRoutes");
const productsAdminRoutes = require("./routes/productAdminRoutes");
const orderAdminRoutes = require("./routes/adminOrderRoutes");
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

connectDB();

// Handle preflight requests (important)
app.options("*", cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API!");
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoute);

// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productsAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
