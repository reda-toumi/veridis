require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Keep only necessary route imports
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes"); // Added post routes

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", postRoutes); // "/api/posts" is now accessible

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
