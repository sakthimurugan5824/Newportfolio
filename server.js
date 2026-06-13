const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// SPA fallback - serve index.html for any non-API route
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).send('Not found');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
const mongoSource = process.env.MONGO_URI ? 'environment variable' : 'local fallback';

console.log(`MongoDB connection source: ${mongoSource}`);

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
