require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sakthimurugan871_db_user:<db_password>@cluster0.0exyyhi.mongodb.net/?appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const username = 'admin'; // Change this if you like
        const password = 'password123'; // Change this if you like

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username,
            password: hashedPassword
        });

        await newAdmin.save();
        console.log(`Admin created successfully:\nUsername: ${username}\nPassword: ${password}`);
        process.exit(0);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
