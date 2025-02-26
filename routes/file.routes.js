// routes/file.routes.js
const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public route for viewing files
router.get("/public/:id", fileController.viewFile);

// Protected routes
router.use(protect);
router.post("/upload", fileController.uploadFile);
router.get("/", fileController.getUserFiles);
router.get("/:id", fileController.getFileById);
router.delete("/:id", fileController.deleteFile);

module.exports = router;
