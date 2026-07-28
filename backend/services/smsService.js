import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

export const sendOrderSMS = async (customerName, phone, orderId, invoiceNumber, grandTotal) => {
    const isMock = !accountSid || !authToken;

    const messageBody = `Hello ${customerName},\n\nYour Cookie Heaven order has been confirmed.\n\nOrder ID: ${orderId}\nInvoice No: ${invoiceNumber}\nAmount: ${grandTotal}\n\nThank you for shopping with Cookie Heaven.`;

    if (isMock) {
        console.log('\n==================================================');
        console.log(`📱 [MOCK SMS DISPATCH] To: ${phone}`);
        console.log(messageBody);
        console.log('==================================================\n');
        return true;
    }

    try {
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            body: messageBody,
            from: fromPhone,
            to: phone
        });
        console.log('SMS sent:', message.sid);
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
};
