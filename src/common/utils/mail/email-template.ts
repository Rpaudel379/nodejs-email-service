import { EmailEntity } from "@email/models/email.model";

export const emailTemplate = (
  prevMail: EmailEntity,
  body: string
) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
    }
    .header {
      background-color: #007bff;
      color: white;
      text-align: center;
      padding: 10px 0;
      border-radius: 5px 5px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #555;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Our Service</h1>
    </div>
    <div class="content">
      <p>Dear ${prevMail.from?.value[0].name || prevMail.text},</p>
      <p>Thank you for issuing your ticket with us!</p>
    
      <div>
        ${body}
      </div>
      <p>Best regards,</p>
      <p>The LogicaBeans Team</p>
    </div>
    </hr>
    ${prevMail.textAsHtml}
    <div class="footer">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
