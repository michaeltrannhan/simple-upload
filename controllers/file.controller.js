// controllers/file.controller.js
const mongoose = require("mongoose");
const File = require("../models/file.model");
const { getBucket, generateUniqueFilename } = require("../utils/gridfs.util");
const fs = require("fs");
const multer = require("multer");
const { Readable } = require("stream");

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    // Validate file types - only accept images for this example
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
}).single("file");

// Upload file to GridFS
exports.uploadFile = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred
        return res
          .status(400)
          .json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    try {
      const bucket = getBucket();
      const uniqueFilename = generateUniqueFilename(req.file.originalname);

      // Create a readable stream from buffer
      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);

      // Upload to GridFS
      const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType: req.file.mimetype,
      });

      readableStream.pipe(uploadStream);

      uploadStream.on("error", (error) => {
        return next(error);
      });

      uploadStream.on("finish", async () => {
        try {
          // Create file record in database
          const fileRecord = new File({
            filename: uniqueFilename,
            originalname: req.file.originalname,
            contentType: req.file.mimetype,
            size: req.file.size,
            user: req.user.id,
          });

          await fileRecord.save();

          res.status(201).json({
            message: "File uploaded successfully",
            file: {
              id: fileRecord._id,
              filename: fileRecord.filename,
              originalname: fileRecord.originalname,
              contentType: fileRecord.contentType,
              size: fileRecord.size,
              uploadDate: fileRecord.uploadDate,
            },
          });
        } catch (error) {
          console.log(error);
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  });
};

// Get all files for a user
exports.getUserFiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count of files for pagination
    const totalFiles = await File.countDocuments({ user: req.user.id });

    // Get paginated files
    const files = await File.find({ user: req.user.id })
      .sort({ uploadDate: -1 })
      .select('filename originalname contentType size uploadDate')
      .skip(skip)
      .limit(limit);

    // Transform files to match desired response format
    const transformedFiles = files.map(file => ({
      id: file._id,
      filename: file.filename,
      originalname: file.originalname,
      contentType: file.contentType,
      size: file.size,
      uploadDate: file.uploadDate
    }));

    res.status(200).json({
      files: transformedFiles,
      pagination: {
        totalFiles,
        totalPages: Math.ceil(totalFiles / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get file by ID
exports.getFileById = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const bucket = getBucket();
    const downloadStream = bucket.openDownloadStreamByName(file.filename);

    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `inline; filename="${file.originalname}"`);

    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      return next(error);
    });
  } catch (error) {
    next(error);
  }
};

// Delete file
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const bucket = getBucket();

    // Find the file in GridFS by filename
    const gridFSFiles = await bucket
      .find({ filename: file.filename })
      .toArray();

    if (gridFSFiles.length === 0) {
      return res.status(404).json({ message: "File not found in storage" });
    }

    // Delete file from GridFS
    await bucket.delete(gridFSFiles[0]._id);

    // Delete file record from database
    await File.findByIdAndDelete(file._id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};
