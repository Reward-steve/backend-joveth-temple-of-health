export const verifyEmailTemplate = (username, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #2c3e50;
          }
          p {
            font-size: 16px;
            color: #555555;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            font-size: 16px;
            color: white;
            background-color: #00b894;
            border-radius: 8px;
            text-decoration: none;
          }
          .footer {
            font-size: 14px;
            color: #999999;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${username},</h2>
          <p>
            Thank you for signing up for our Hospital Medical Application.<br />
            Please verify your email address by clicking the button below:
          </p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>This link will expire in 24 hours for your security.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Hospital Medical System. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `;
};
