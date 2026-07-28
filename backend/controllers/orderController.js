import pool from '../config/db.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateInvoicePDF } from '../services/pdfService.js';
import { sendInvoiceEmail } from '../services/emailService.js';
import { sendOrderSMS } from '../services/smsService.js';
import { sendInvoiceWhatsApp } from '../services/whatsappService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAll(req, res) {
    try {
        const { search, status, sort } = req.query;
        let sql = 'SELECT * FROM orders WHERE 1=1';
        const params = [];

        if (search) {
            sql += ' AND (id LIKE ? OR order_number LIKE ? OR customer_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status && status !== 'All') {
            sql += ' AND order_status = ?';
            params.push(status);
        }

        // Sorting
        if (sort === 'Oldest Orders') {
            sql += ' ORDER BY created_at ASC';
        } else if (sort === 'Highest Amount') {
            sql += ' ORDER BY total_amount DESC';
        } else if (sort === 'Lowest Amount') {
            sql += ' ORDER BY total_amount ASC';
        } else {
            // Default: Latest Orders
            sql += ' ORDER BY created_at DESC';
        }

        const [rows] = await pool.query(sql, params);

        // Map over orders and attach items
        const ordersWithItems = await Promise.all(rows.map(async (order) => {
            const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            return { ...order, items };
        }));

        res.json(ordersWithItems);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getById(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
        res.json({ ...rows[0], items });
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function updateStatus(req, res) {
    try {
        const { status } = req.body;
        await pool.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, req.params.id]);
        const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        res.json(order[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function updateOrder(req, res) {
    try {
        const allowed = ['order_status', 'payment_status', 'payment_method', 'email', 'phone', 'address', 'city', 'state', 'postal_code'];
        const fields = [];
        const values = [];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(req.body[key]);
            }
        }
        if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
        values.push(req.params.id);
        await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`, values);
        const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
        res.json({ ...order[0], items });
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function remove(req, res) {
    try {
        await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        res.json({ message: 'Order deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function createOrder(req, res) {
    let conn;
    try {
        const { customer_name, email, phone, address, payment_method, total_amount, items, subtotal, delivery_charge, discount, tax, grand_total } = req.body;

        conn = await pool.getConnection();
        await conn.beginTransaction();

        // ─── Generate Order ID & Invoice Number ────────────────────
        // Check latest order to increment
        const [lastOrder] = await conn.query(`SELECT id FROM orders ORDER BY id DESC LIMIT 1`);
        const nextId = lastOrder.length > 0 ? lastOrder[0].id + 1 : 1;

        const paddedId = String(nextId).padStart(6, '0');
        const order_number = `CH-2026-${paddedId}`;
        const invoice_number = `INV-2026-${paddedId}`;

        const [result] = await conn.query(
            `INSERT INTO orders (order_number, customer_name, email, phone, address, payment_method, total_amount, order_status, payment_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', 'Paid')`, // Set to Paid immediately per successful logic
            [order_number, customer_name, email || '', phone || '', address || '', payment_method || 'Cash on Delivery', grand_total || total_amount]
        );
        const orderId = result.insertId;

        if (items && items.length > 0) {
            for (const item of items) {
                await conn.query(
                    `INSERT INTO order_items (order_id, product_name, product_image, quantity, price, subtotal)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [orderId, item.name, item.img || null, item.quantity, item.price, item.price * item.quantity]
                );
            }
        }

        // ─── Generate Invoice Details ─────────────────────────
        const pdfFilename = `Invoice_${invoice_number}.pdf`;

        // Define directory paths properly from project root (so public/invoices exists)
        const invoiceDir = path.join(__dirname, '..', 'public', 'invoices');
        const pdfAbsolutePath = path.join(invoiceDir, pdfFilename);
        const pdfRelativePath = `/invoices/${pdfFilename}`;

        // Insert into Invoices table
        await conn.query(
            `INSERT INTO invoices (invoice_number, order_id, customer_name, email, phone, subtotal, delivery_charge, discount, tax, grand_total, payment_method, payment_status, pdf_path)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Paid', ?)`,
            [invoice_number, orderId, customer_name, email || '', phone || '', subtotal || total_amount, delivery_charge || 0, discount || 0, tax || 0, grand_total || total_amount, payment_method || 'Cash on Delivery', pdfRelativePath]
        );

        await conn.commit();

        // ─── Trigger Async Services (PDF, Email, SMS) ───────
        try {
            const invoiceData = {
                invoice_number,
                order_number,
                customer_name,
                email,
                phone,
                address,
                subtotal: subtotal || total_amount,
                delivery_charge: delivery_charge || 0,
                discount: discount || 0,
                tax: tax || 0,
                grand_total: grand_total || total_amount,
                payment_method: payment_method || 'Cash on Delivery',
                payment_status: 'Paid',
                items: items || [],
                created_at: new Date()
            };

            await generateInvoicePDF(invoiceData, pdfAbsolutePath);

            // Send email and SMS concurrently in background
            if (email) {
                sendInvoiceEmail(customer_name, email, order_number, invoice_number, grand_total || total_amount, pdfAbsolutePath).catch(console.error);
            }
            if (phone) {
                sendOrderSMS(customer_name, phone, order_number, invoice_number, `$${Number(grand_total || total_amount).toFixed(2)}`).catch(console.error);
            }

            // Send WhatsApp invoice in background
            if (phone) {
                const baseUrl = process.env.APP_URL || 'http://localhost:5000';
                const invoiceDownloadUrl = `${baseUrl}${pdfRelativePath}`;
                sendInvoiceWhatsApp(customer_name, phone, order_number, invoice_number, grand_total || total_amount, invoiceDownloadUrl)
                    .then(async (result) => {
                        try {
                            const conn2 = await pool.getConnection();
                            await conn2.query(
                                `INSERT INTO whatsapp_logs (order_id, invoice_number, customer_name, phone_number, message_status, message_id, invoice_url, sent_at)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                                [orderId, invoice_number, customer_name, phone, result.status, result.messageId, invoiceDownloadUrl]
                            );
                            conn2.release();
                        } catch (logErr) {
                            console.error('Error logging WhatsApp status:', logErr);
                        }
                    })
                    .catch(console.error);
            }

        } catch (serviceErr) {
            console.error('Error in background services (PDF/Email/SMS/WhatsApp):', serviceErr);
        }

        res.status(201).json({ id: orderId, order_number, invoice_number, pdf_path: pdfRelativePath });
    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
}

