import nodemailer from "nodemailer";

/**
 * Robust SMTP transporter for SendLink.
 * Uses connection pooling and optimized timeouts to prevent ETIMEDOUT errors.
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587 (STARTTLS)
    pool: true,    // reuse connections
    maxConnections: 5,
    maxMessages: 100,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Connection timeouts in milliseconds
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

// Verify connection configuration on startup
transporter.verify((error) => {
    if (error) {
        console.error("Mail Transporter Error:", error);
    } else {
        console.log("Mail Transporter is ready to deliver messages");
    }
});

export default transporter;
