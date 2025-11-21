"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const resend_1 = require("../lib/resend");
const emailTemplates_1 = require("../emails/emailTemplates");
const sendWelcomeEmail = async (userEmail, userName, clientUrl) => {
    try {
        const { data, error } = await resend_1.resendClient.emails.send({
            from: `${resend_1.sender.name} <${resend_1.sender.email}>`,
            to: userEmail,
            subject: "Welcome to Chatify",
            html: (0, emailTemplates_1.createWelcomeEmailTemplate)(userName, clientUrl),
        });
        if (error) {
            console.error("Error sending welcome email:", error);
            throw new Error('Failed to send welcome email.');
        }
        console.log("Welcome email sent successfully:", data);
    }
    catch (err) {
        console.error("Unexpected error sending email:", err);
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
