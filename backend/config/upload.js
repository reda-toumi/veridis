const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Define upload paths
const UPLOAD_DIR = "uploads";
const UPLOAD_PATH = path.join(__dirname, "..", UPLOAD_DIR);

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = {
  upload,
  UPLOAD_DIR,
  UPLOAD_PATH
}; 