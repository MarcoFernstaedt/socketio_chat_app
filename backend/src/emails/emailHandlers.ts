import { resendClient, sender } from "../lib/resend";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates";

export const sendWelcomeEmail = async (
  userEmail: string,
  userName: string,
  clientUrl: string
): Promise<void> => {
  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: userEmail, 
      subject: "Welcome to Chatify",
      html: createWelcomeEmailTemplate(userName, clientUrl),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      throw new Error('Failed to send welcome email.');
    }

    console.log("Welcome email sent successfully:", data);
  } catch (err) {
    console.error("Unexpected error sending email:", err);
  }
};
