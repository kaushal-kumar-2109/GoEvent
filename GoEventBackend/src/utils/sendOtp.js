const nodemailer = require("nodemailer");

// 1. Create a transporter object using Gmail SMTP
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.SMTP_USER_EMAIL,
//         pass: process.env.SMTP_USER_PASS
//     }
// });
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP,         // From your Brevo screen
    port: process.env.BREVO_PORT,                            // From your Brevo screen
    secure: false,                        // MUST be false for port 587 (TLS upgrade)
    auth: {
        user: process.env.BREVO_LOGIN,    // Your exact Login from the screen
        pass: process.env.BREVO_SMTP_KEY,    // The secret password key you copied in Step 1
    },
    tls: {
        rejectUnauthorized: false           // Crucial to prevent Render network blockages
    }
});

// 2. Define the email options
const createMailOptions = (email, otp, tag) => {
    // 1. Determine dynamic text based on the tag (login or signup)
    const isSignup = tag.toLowerCase() === 'register';
    const actionText = isSignup ? 'creating your GoEvent account' : 'logging into your GoEvent account';
    const subjectText = isSignup ? 'Verify your GoEvent Account' : 'GoEvent Login Verification Code';
    const headingText = isSignup ? 'Verify Your Account' : 'Welcome Back!';

    // 2. Build the professional HTML layout
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subjectText}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f4f5f7; padding: 40px 0; }
            .container { max-width: 500px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e4e8; }
            .header { background-color: #4F46E5; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
            .content p { font-size: 15px; margin: 0 0 20px 0; color: #4A5568; }
            .otp-container { background-color: #F3F4F6; border: 1px dashed #4F46E5; border-radius: 6px; padding: 16px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4F46E5; margin: 0; font-family: 'Courier New', Courier, monospace; }
            .footer { padding: 0 30px 40px 30px; font-size: 13px; color: #718096; border-top: 1px solid #EDF2F7; padding-top: 20px; }
            .footer p { margin: 0 0 8px 0; }
            .company { font-weight: 600; color: #4A5568; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <!-- Header / Branding -->
                <div class="header">
                    <h1>GoEvent ${headingText}</h1>
                </div>
                
                <!-- Main Body Content -->
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for choosing GoEvent! You are receiving this email because a request was made for <strong>${actionText}</strong>.</p>
                    <p>Please use the verification code below to complete your authentication. This code is valid for the next 10 minutes.</p>
                    
                    <!-- OTP Display Box -->
                    <div class="otp-container">
                        <h2 class="otp-code">${otp}</h2>
                    </div>
                    
                    <p>If you did not make this request, you can safely ignore this email. Your account remains secure.</p>
                </div>
                
                <!-- Professional Regards & Footer -->
                <div class="footer">
                    <p>Best regards,</p>
                    <p class="company">The GoEvent Security Team</p>
                    <p style="font-size: 11px; color: #A0AEC0; margin-top: 20px;">This is an automated system message. Please do not reply directly to this email.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // 3. Fallback plain text version for non-HTML mail clients
    const textContent = `Hello,\n\nThank you for choosing GoEvent! Your verification code for ${actionText} is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this code, please disregard this email.\n\nBest regards,\nThe GoEvent Security Team`;

    return {
        from: `"GoEvent Team" <${process.env.SMTP_USER_EMAIL}>`,
        to: email,
        subject: subjectText,
        text: textContent,
        html: htmlContent
    };
};

// 3. Send the email
const SendEmail = async (email, otp, tag = "register") => {
    const mailOptions = createMailOptions(email, otp, tag);
    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.accepted.length > 0) return ({ status: true, message: 'Email sent successfully!', info: info });
        if (info.rejected.length > 0) return ({ status: false, message: 'Email not Send!', info: info });
    } catch (error) {
        console.error('Error sending email:', error);
        return ({ status: false, message: 'Failed to send email!', info: error });
    }
}

module.exports = SendEmail;