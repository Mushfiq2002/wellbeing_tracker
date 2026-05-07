const cron = require('node-cron');
const User = require('../models/userModel');
const { sendWarningEmail, sendEmergencyAlertEmail } = require('../services/emailService');

// Run everyday at midnight: '0 0 * * *'
// For testing purposes, you could change this to '* * * * *' to run every minute.
const startEmergencyAlertJob = () => {
    //cron.schedule('0 0 * * *', async () => {
    cron.schedule('* * * * *', async () => {
        console.log('Running emergency alert cron job...');
        try {
            const now = new Date();
            const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

            // Find all users who haven't logged in recently
            // We can query all users and evaluate, or use complex queries. 
            // For simplicity, we fetch users who might be eligible.
            const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });

            for (const user of inactiveUsers) {
                // Rule 2: Inactive for 3+ days
                if (user.lastLogin < threeDaysAgo) {
                    if (!user.emergencyAlertSentAt) {
                        // Send alert to all emergency contacts
                        if (user.emergencyContacts && user.emergencyContacts.length > 0) {
                            for (const contact of user.emergencyContacts) {
                                await sendEmergencyAlertEmail(user, contact);
                            }
                        }
                        await User.updateOne({ _id: user._id }, { $set: { emergencyAlertSentAt: new Date() } });
                    }
                }
                // Rule 1: Inactive for 2+ days but less than 3 days
                else if (user.lastLogin < twoDaysAgo && user.lastLogin >= threeDaysAgo) {
                    if (!user.warningEmailSentAt) {
                        // Send warning email to user
                        await sendWarningEmail(user);
                        await User.updateOne({ _id: user._id }, { $set: { warningEmailSentAt: new Date() } });
                    }
                }
            }
        } catch (error) {
            console.error('Error in emergency alert cron job:', error);
        }
    });
};

module.exports = startEmergencyAlertJob;
