// Load environment variables from a .env file
require('dotenv').config();

const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI; // Use your actual environment variable name

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
