const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

const projects = [
    {
        title: 'Vehicles and Obstacles Detection in Fog',
        description: 'Developed a robust low-visibility detection system tailored for foggy conditions. Utilized LiDAR sensor integration paired with AI-driven object detection models to improve driving safety and situational awareness.',
        techStack: ['YOLOv8', 'OpenCV', 'Python', 'LiDAR', 'Arduino'],
        iconClass: 'fas fa-car-side',
        colorTheme: 'blue'
    },
    {
        title: 'Pothole Detection system',
        description: 'Built an accurate real-time pothole detection system using modern deep learning techniques. Processes video feeds rapidly to identify road damages, aimed at assisting automated road maintenance and smart city infrastructure.',
        techStack: ['YOLOv8', 'OpenCV', 'Python', 'Deep Learning'],
        iconClass: 'fas fa-road',
        colorTheme: 'purple'
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio')
.then(async () => {
    console.log('Connected to MongoDB for seeding');
    const count = await Project.countDocuments();
    if (count === 0) {
        await Project.insertMany(projects);
        console.log('Successfully seeded projects');
    } else {
        console.log('Database already contains projects. Skipping seed.');
    }
    mongoose.connection.close();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
