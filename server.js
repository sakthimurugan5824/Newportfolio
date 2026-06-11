require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve frontend static files from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);

// Serve top-level image if referenced from frontend (keeps original image in project root)
app.get('/IMG_20251120_154135_333.png', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'IMG_20251120_154135_333.png'));
});

// SPA fallback - serve index.html for any non-API route
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).send('Not found');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
