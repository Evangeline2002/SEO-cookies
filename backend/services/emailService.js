import nodemailer from 'nodemailer';

// Mock credentials fallback
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'mock@example.com',
        pass: process.env.SMTP_PASS || 'mockpassword',
    },
});

export const sendInvoiceEmail = async (customerName, email, orderId, invoiceNumber, grandTotal, pdfPath) => {
    const isMock = !process.env.SMTP_USER;

    if (isMock) {
        console.log('\n==================================================');
        console.log(`📧 [MOCK EMAIL DISPATCH] To: ${email}`);
        console.log(`Subject: Cookie Heaven - Your Order Invoice`);
        console.log(`Body:`);
        console.log(`Hello ${customerName},\n`);
        console.log(`Thank you for shopping with Cookie Heaven.`);
        console.log(`Your order has been confirmed successfully.\n`);
        console.log(`Order ID:\n${orderId}`);
        console.log(`Invoice Number:\n${invoiceNumber}\n`);
        console.log(`Total Amount:\n₹${Number(grandTotal).toFixed(2)}\n`);
        console.log(`Please find your invoice attached as a PDF.\n`);
        console.log(`Thank you for choosing Cookie Heaven.`);
        console.log('==================================================\n');
        return true;
    }

    try {
        const mailOptions = {
            from: '"Cookie Heaven" <no-reply@cookieheaven.com>',
            to: email,
            subject: 'Cookie Heaven - Your Order Invoice',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2>Hello ${customerName},</h2>
                    <p>Thank you for shopping with Cookie Heaven.</p>
                    <p>Your order has been confirmed successfully.</p>
                    <p><strong>Order ID:</strong><br>${orderId}</p>
                    <p><strong>Invoice Number:</strong><br>${invoiceNumber}</p>
                    <p><strong>Total Amount:</strong><br>₹${Number(grandTotal).toFixed(2)}</p>
                    <p>Please find your invoice attached as a PDF.</p>
                    <p>Thank you for choosing Cookie Heaven.</p>
                </div>
            `,
            attachments: [
                {
                    filename: `Invoice_${invoiceNumber}.pdf`,
                    path: pdfPath,
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
