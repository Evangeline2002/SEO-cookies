import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendInvoiceEmail } from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllInvoices(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getInvoiceById(req, res) {
    try {
        const { id } = req.params;
        const [invoices] = await pool.query('SELECT * FROM invoices WHERE id = ?', [id]);
        if (invoices.length === 0) return res.status(404).json({ error: 'Invoice not found' });

        const invoice = invoices[0];
        // Fetch order items to display on the invoice view
        if (invoice.order_id) {
            const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [invoice.order_id]);
            invoice.items = items;
        } else {
            invoice.items = [];
        }

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateInvoice(req, res) {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        await pool.query('UPDATE invoices SET payment_status = ? WHERE id = ?', [payment_status, id]);
        res.json({ message: 'Invoice updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function downloadInvoicePDF(req, res) {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT pdf_path FROM invoices WHERE id = ?', [id]);

        if (rows.length === 0 || !rows[0].pdf_path) {
            return res.status(404).json({ error: 'Invoice PDF not found' });
        }

        const pdfAbsolutePath = path.join(__dirname, '..', 'public', rows[0].pdf_path);

        if (!fs.existsSync(pdfAbsolutePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.download(pdfAbsolutePath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteInvoice(req, res) {
    try {
        const { id } = req.params;

        // Find invoice to get pdf_path
        const [rows] = await pool.query('SELECT pdf_path FROM invoices WHERE id = ?', [id]);

        if (rows.length > 0 && rows[0].pdf_path) {
            const pdfAbsolutePath = path.join(__dirname, '..', 'public', rows[0].pdf_path);
            if (fs.existsSync(pdfAbsolutePath)) {
                fs.unlinkSync(pdfAbsolutePath);
            }
        }

        await pool.query('DELETE FROM invoices WHERE id = ?', [id]);
        res.json({ message: 'Invoice and associated PDF deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function resendInvoice(req, res) {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT i.*, o.order_number FROM invoices i LEFT JOIN orders o ON i.order_id = o.id WHERE i.id = ?', [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });

        const invoice = rows[0];

        if (!invoice.email) {
            return res.status(400).json({ error: 'Invoice does not have an associated email address' });
        }

        const pdfAbsolutePath = invoice.pdf_path ? path.join(__dirname, '..', 'public', invoice.pdf_path) : null;

        if (!pdfAbsolutePath || !fs.existsSync(pdfAbsolutePath)) {
            return res.status(404).json({ error: 'Invoice PDF file not found on server' });
        }

        // Call the email service
        const success = await sendInvoiceEmail(
            invoice.customer_name,
            invoice.email,
            invoice.order_number || `Order #${invoice.order_id}`,
            invoice.invoice_number,
            invoice.grand_total,
            pdfAbsolutePath
        );

        if (success) {
            res.json({ message: 'Invoice resent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send email' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
