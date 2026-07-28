import pool from '../config/db.js';
import { sendInvoiceWhatsApp } from '../services/whatsappService.js';

export async function getWhatsAppLogs(req, res) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM whatsapp_logs ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function sendWhatsApp(req, res) {
    try {
        const { orderId } = req.params;

        const [orders] = await pool.query(
            'SELECT order_number, customer_name, phone, total_amount FROM orders WHERE id = ?',
            [orderId]
        );
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const [invoices] = await pool.query(
            'SELECT invoice_number, pdf_path FROM invoices WHERE order_id = ?',
            [orderId]
        );
        if (invoices.length === 0) {
            return res.status(404).json({ error: 'Invoice not found for this order' });
        }

        const order = orders[0];
        const invoice = invoices[0];
        const baseUrl = process.env.APP_URL || 'http://localhost:5000';
        const invoiceUrl = `${baseUrl}${invoice.pdf_path}`;

        const result = await sendInvoiceWhatsApp(
            order.customer_name,
            order.phone,
            order.order_number,
            invoice.invoice_number,
            order.total_amount,
            invoiceUrl
        );

        const [logResult] = await pool.query(
            `INSERT INTO whatsapp_logs (order_id, invoice_number, customer_name, phone_number, message_status, message_id, invoice_url, sent_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [Number(orderId), invoice.invoice_number, order.customer_name, order.phone, result.status, result.messageId, invoiceUrl]
        );

        const [logRows] = await pool.query(
            'SELECT * FROM whatsapp_logs WHERE id = ?',
            [logResult.insertId]
        );

        res.status(201).json(logRows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function resendWhatsApp(req, res) {
    try {
        const { id } = req.params;

        const [logs] = await pool.query('SELECT * FROM whatsapp_logs WHERE id = ?', [id]);
        if (logs.length === 0) {
            return res.status(404).json({ error: 'WhatsApp log not found' });
        }

        const log = logs[0];
        const [orders] = await pool.query(
            'SELECT order_number, total_amount FROM orders WHERE id = ?',
            [log.order_id]
        );

        const orderNumber = orders.length > 0 ? orders[0].order_number : `Order #${log.order_id}`;
        const grandTotal = orders.length > 0 ? orders[0].total_amount : 0;

        const result = await sendInvoiceWhatsApp(
            log.customer_name,
            log.phone_number,
            orderNumber,
            log.invoice_number,
            grandTotal,
            log.invoice_url
        );

        await pool.query(
            `UPDATE whatsapp_logs SET message_status = ?, message_id = ?, sent_at = NOW(), delivered_at = NULL WHERE id = ?`,
            [result.status, result.messageId, id]
        );

        const [updated] = await pool.query('SELECT * FROM whatsapp_logs WHERE id = ?', [id]);
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'cookieheaven_verify_2026';

    if (mode === 'subscribe' && token === expectedToken) {
        console.log('WhatsApp webhook verified');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
}

export async function handleWebhook(req, res) {
    try {
        const entry = req.body?.entry;
        if (!entry) {
            return res.sendStatus(200);
        }

        for (const e of entry) {
            const changes = e.changes || [];
            for (const change of changes) {
                const statuses = change.value?.statuses || [];
                for (const status of statuses) {
                    const messageId = status.id;
                    const statusName = status.status;

                    if (['sent', 'delivered', 'failed', 'read'].includes(statusName)) {
                        let dbStatus;
                        if (statusName === 'read' || statusName === 'delivered') {
                            dbStatus = 'Delivered';
                        } else if (statusName === 'sent') {
                            dbStatus = 'Sent';
                        } else {
                            dbStatus = 'Failed';
                        }

                        const updateFields = ['message_status = ?'];
                        const updateValues = [dbStatus];

                        if (statusName === 'delivered' || statusName === 'read') {
                            updateFields.push('delivered_at = NOW()');
                        }

                        updateValues.push(messageId);

                        await pool.query(
                            `UPDATE whatsapp_logs SET ${updateFields.join(', ')} WHERE message_id = ?`,
                            updateValues
                        );
                    }
                }
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('WhatsApp webhook error:', err);
        res.sendStatus(200);
    }
}
