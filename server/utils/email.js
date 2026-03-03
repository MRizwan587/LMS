import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (user, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,   
        secure: process.env.EMAIL_SECURE === 'true' || false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            minVersion: 'TLSv1.2',   
            rejectUnauthorized: false, 
        },
        family: 4,                         
        logger: true,                      
        debug: true                        
    });

    try {
        await transporter.verify();
    } catch (verifyErr) {
        console.error('SMTP verify failed:', verifyErr);
    }

    const mailOptions = {
        from: `"Library System" <${process.env.EMAIL_USER}>`,  
        to: user.email,
        subject: 'OTP for your library account verification',
        html: `<p>Welcome <strong>${user.name || 'User'}</strong>,</p>
        <p style="width: 20%; color: #fff;  font-size: 16px; font-weight: 600; border: 1px solid #000; padding: 10px; border-radius: 5px; text-align: center; background-color: #000;">${otp}</p>
               <p>Here is Your OTP for your library account verification. Please use this OTP to verify your library account</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully! Message ID:', info.messageId);
    } catch (err) {
        console.error('Email send failed:', err);
        throw err;  
    }
};