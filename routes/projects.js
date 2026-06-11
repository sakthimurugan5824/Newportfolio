const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Public route to get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
});

// Protected route to create a project
router.post('/', auth, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Failed to create project.' });
    }
});

// Protected route to update a project
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

// Protected route to delete a project
router.delete('/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

module.exports = router;
