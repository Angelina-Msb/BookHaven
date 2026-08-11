const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// Add this line with your other routes
app.use('/api/books', require('./routes/bookRoutes'));
// Test Route
app.get('/', (req, res) => {
    res.send('BookHaven API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});