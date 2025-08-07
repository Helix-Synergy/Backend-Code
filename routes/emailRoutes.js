const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer'); // Make sure you have nodemailer installed!

// Configure Nodemailer transporter for Hostinger email
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Hostinger's SMTP host
    port: 465,                   // Hostinger's SMTP secure port (usually 465 for SSL)
    secure: true,                // Use SSL
    auth: {
        user: process.env.EMAIL_USER,     // Your full Hostinger email address (e.g., info@yourdomain.com)
        pass: process.env.EMAIL_PASS      // The password for your Hostinger email account
    },
    // Optional: You might need to set a timeout if you experience connection issues
    // timeout: 10000, // 10 seconds
});

router.post('/send-registration-email', async (req, res) => {
    const { conferenceId, conferenceName, selectedItems, totalAmount, participantInfo } = req.body;

    // Basic validation (you can add more robust validation here)
    if (!conferenceId || !conferenceName || !selectedItems || !participantInfo || totalAmount === undefined) {
        return res.status(400).json({ message: 'Missing required registration details.' });
    }

    // Format selected items for the email
    let itemsHtml = '<ul style="list-style-type: none; padding: 0;">';
    for (const category in selectedItems) {
        const item = selectedItems[category];
        itemsHtml += `<li style="margin-bottom: 5px;"><strong>${category}:</strong> Quantity - ${item.quantity}</li>`;
    }
    itemsHtml += '</ul>';

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address (your Hostinger email)
        to: participantInfo.email,    // Recipient address from the form
        bcc: process.env.EMAIL_USER,  // BCC yourself for records
        subject: `Registration Confirmation for ${conferenceName}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f7f7f7; padding: 20px;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                    <h2 style="color: #004466;">Dear ${participantInfo.fullName},</h2>
                    <p>Thank you for registering for the <strong>${conferenceName}</strong>!</p>
                    
                    <h3 style="color: #0077aa; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Your Registration Details:</h3>
                    <p><strong>Conference ID:</strong> ${conferenceId}</p>
                    <p><strong>Participant Type:</strong> ${participantInfo.organization || 'N/A'}</p>
                    <p><strong>Selected Items:</strong></p>
                    ${itemsHtml}
                    <p style="font-size: 1.2em; font-weight: bold; color: #555555; background-color: #e9ecef; padding: 10px; border-radius: 4px;">Total Amount: $${totalAmount.toFixed(2)}</p>

                    <h3 style="color: #0077aa; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-top: 20px;">Your Contact Information:</h3>
                    <p><strong>Email:</strong> ${participantInfo.email}</p>
                    <p><strong>Country:</strong> ${participantInfo.country}</p>
                    <p><strong>Phone:</strong> ${participantInfo.phone || 'N/A'}</p>
                    
                    <p>We look forward to seeing you at the conference!</p>
                    <p>Best regards,</p>
                    <p>The ${conferenceName} Team</p>
                </div>
                <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
                <p style="font-size: 0.8em; color: #888888; text-align: center;">This is an automated email, please do not reply directly to this message.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Registration email sent successfully to:', participantInfo.email);
        res.status(200).json({ message: 'Registration email sent successfully!' });
    } catch (error) {
        console.error('Error sending registration email:', error);
        res.status(500).json({ message: 'Failed to send registration email.', error: error.message });
    }
});

module.exports = router;