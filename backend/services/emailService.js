const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendWarningEmail = async (user) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Wellbeing Tracker" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Wellbeing Tracker - Are you okay?',
            text: `Hi ${user.name},\n\nIs anything wrong? We noticed you haven't logged into the Wellbeing Tracker for the last 2 days.\n\nPlease log in to let us know you're okay. If you are inactive for 3 days, we will contact your registered emergency contacts.\n\nBest,\nWellbeing Tracker Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Warning email sent to user: ${user.email}`);
    } catch (error) {
        console.error('Error sending warning email:', error);
    }
};

const sendEmergencyAlertEmail = async (user, contact) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Wellbeing Tracker" <${process.env.EMAIL_USER}>`,
            to: contact.email,
            subject: `Emergency Alert: Please contact ${user.name}`,
            text: `Dear ${contact.name},\n\nUser ${user.name} hasn't logged into the Wellbeing Tracker for 3 days.\n\nPlease do contact the user to make sure they are okay.\n\nBest,\nWellbeing Tracker Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Emergency alert email sent to contact: ${contact.email} for user: ${user.email}`);
    } catch (error) {
        console.error('Error sending emergency alert email:', error);
    }
};

module.exports = {
    sendWarningEmail,
    sendEmergencyAlertEmail,
};
