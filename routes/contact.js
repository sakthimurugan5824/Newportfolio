const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        
        // Send email via Resend
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'sakthimurugan871@gmail.com', // Replace with your receiving email if you use a custom domain
                subject: `New Portfolio Message: ${subject}`,
                html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong> ${message}</p>`
            });
        }

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;
