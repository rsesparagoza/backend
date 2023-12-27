require('dotenv').config();

const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI; 

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
