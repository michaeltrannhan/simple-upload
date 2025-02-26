// utils/gridfs.util.js
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const crypto = require("crypto");

let bucket;

// Initialize GridFS bucket
const initBucket = (db) => {
  bucket = new GridFSBucket(db, {
    bucketName: "uploads",
  });
  return bucket;
};

// Get GridFS bucket instance
const getBucket = () => {
  if (!bucket) {
    const db = mongoose.connection.db;
    return initBucket(db);
  }
  return bucket;
};

// Generate unique filename
const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = originalname.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
};

module.exports = {
  getBucket,
  initBucket,
  generateUniqueFilename,
};
