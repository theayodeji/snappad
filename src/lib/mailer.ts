import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "onesixteenj@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendOtpMail = async (to: string, otp: string) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        border-top: 6px solid #4090ff;
      }

      .header {
        background-color: #4090ff;
        color: #ffffff;
        padding: 24px;
        text-align: center;
      }

      .header h1 {
        margin: 0;
        font-size: 24px;
        letter-spacing: 0.5px;
      }

      .content {
        padding: 32px 24px;
        color: #333333;
        line-height: 1.6;
      }

      .otp-box {
        background-color: #f4f7fe;
        color: #4090ff;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        padding: 16px;
        margin: 24px auto;
        border-radius: 8px;
        letter-spacing: 6px;
        width: fit-content;
      }

      .footer {
        background-color: #fdf4f7;
        color: #ff7598;
        padding: 20px;
        text-align: center;
        font-size: 14px;
      }

      .footer a {
        color: #ff7598;
        text-decoration: none;
      }

      .footer a:hover {
        text-decoration: underline;
      }

      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4090ff;
        color: #fff;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 24px;
      }
</style>
</head>
    <body>
      <div class="container">
        <div class="header"><h1>Verify Your Email</h1></div>
        <div class="content">
          <p>Hello 👋,</p>
          <p>Use the OTP below to verify your account:</p>
          <div class="otp-box">${otp}</div>
          <p>It is valid for 10 minutes.</p>
          <p>— The Team</p>
        </div>
        <div class="footer">
          <p>Need help? <a href="mailto:support@yourdomain.com">Contact us</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: "onesixteenj@gmail.com",
    to,
    subject: "Snappad Two-Factor Authentication",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
