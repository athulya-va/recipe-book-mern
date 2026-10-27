const mongoose = require('mongoose');

// Connect to MongoDB Atlas or local MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if Atlas is unreachable
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.warn('Tip: If using MongoDB Atlas, check your network connection and IP Whitelist (allow 0.0.0.0/0).');
    // Note: In development/evaluation, we keep the server alive so APIs can return readable error responses
  }
};

module.exports = connectDB;
