import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "./emailTemplates";

export async function POST(req) {
  try {
    const { email, registration } = await req.json();
    console.log("Received email request for:", email);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Email credentials not configured");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'false' ? false : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Registration Verification - Chitramela 2025",
      html: getVerificationEmailTemplate(registration)
    };

    // Convert callback-based sendMail to Promise
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
