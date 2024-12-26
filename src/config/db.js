const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('DB connected');
  } catch (error) {
    console.error('DB connection failed', error);
  }
};

module.exports = { connectDB };
