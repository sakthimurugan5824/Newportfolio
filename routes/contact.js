const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

const resendApiKey = process.env.RESEND_API_KEY;

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        
        // Send email via Resend only when API key is configured
        if (resendApiKey && resendApiKey !== 'your_resend_api_key_here') {
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'sakthimurugan871@gmail.com', // Replace with your receiving email if you use a custom domain
                subject: `New Portfolio Message: ${subject}`,
                html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong> ${message}</p>`
            });
        } else {
            console.warn('Resend API key is not configured. Contact saved, email not sent.');
        }

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;
