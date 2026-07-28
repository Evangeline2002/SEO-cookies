const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

function formatPhone(phone) {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    if (digits.startsWith('0')) return `+91${digits.slice(1)}`;
    if (digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
}

function buildMessageBody(customerName, orderId, invoiceNumber, grandTotal, invoiceUrl) {
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    return [
        `Hello ${customerName},`,
        '',
        '🎉 Thank you for shopping with Cookie Heaven!',
        '',
        'Your order has been confirmed successfully.',
        '',
        `📦 Order ID: ${orderId}`,
        `🧾 Invoice Number: ${invoiceNumber}`,
        `💳 Total Amount: ₹${Number(grandTotal).toFixed(2)}`,
        `📅 Order Date: ${date}`,
        '',
        '📄 Your invoice is ready.',
        '',
        `👉 Download Invoice: ${invoiceUrl}`,
        '',
        'Thank you for choosing Cookie Heaven!'
    ].join('\n');
}

export async function sendInvoiceWhatsApp(customerName, phone, orderId, invoiceNumber, grandTotal, invoiceUrl) {
    const isMock = !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN;

    const formattedPhone = formatPhone(phone);
    const messageBody = buildMessageBody(customerName, orderId, invoiceNumber, grandTotal, invoiceUrl);

    if (isMock) {
        console.log('\n==================================================');
        console.log(`💬 [MOCK WHATSAPP DISPATCH] To: ${formattedPhone}`);
        console.log('Message:');
        console.log(messageBody);
        console.log('==================================================\n');
        return { messageId: 'mock_' + Date.now(), status: 'Sent' };
    }

    if (!formattedPhone) {
        console.error('Invalid phone number:', phone);
        return { messageId: null, status: 'Failed' };
    }

    try {
        const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: formattedPhone,
                type: 'text',
                text: { body: messageBody }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API error:', data);
            return { messageId: null, status: 'Failed' };
        }

        const messageId = data.messages?.[0]?.id || null;
        console.log('WhatsApp message sent:', messageId);
        return { messageId, status: 'Sent' };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return { messageId: null, status: 'Failed' };
    }
}

export { formatPhone };
