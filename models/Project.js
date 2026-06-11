const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    iconClass: { type: String, default: 'fas fa-laptop-code' },
    colorTheme: { type: String, default: 'blue' }, // Used for styling individual cards (e.g. blue, purple)
    link: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
