import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = (invoiceData, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // ─── Header ─────────────────────────────────────────────────────────
            doc.fillColor('#8B4513')
                .fontSize(24)
                .text('Cookie Heaven', 50, 50);

            doc.fillColor('#555555')
                .fontSize(10)
                .text('Premium Handmade Cookies', 50, 80);

            // ─── Company Details (Right aligned) ────────────────────────────────
            doc.fontSize(10)
                .text('123 Bakery Lane, Sweet Town, ST 12345', 200, 50, { align: 'right' })
                .text('Phone: (555) 123-4567', 200, 65, { align: 'right' })
                .text('Email: hello@cookieheaven.com', 200, 80, { align: 'right' })
                .text('Web: www.cookieheaven.com', 200, 95, { align: 'right' });

            doc.moveDown(3);
            generateHr(doc, doc.y);
            doc.moveDown(2);

            // ─── Invoice & Customer Details ──────────────────────────────────────
            const customerTop = doc.y;

            // Invoice Info
            doc.fontSize(14).fillColor('#333333').text('INVOICE', 50, customerTop);
            doc.fontSize(10).fillColor('#555555')
                .text(`Invoice Number: ${invoiceData.invoice_number}`, 50, customerTop + 20)
                .text(`Order ID: ${invoiceData.order_id || invoiceData.order_number}`, 50, customerTop + 35)
                .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, customerTop + 50)
                .text(`Payment Method: ${invoiceData.payment_method}`, 50, customerTop + 65)
                .text(`Status: ${invoiceData.payment_status}`, 50, customerTop + 80);

            // Customer Info
            doc.fontSize(12).fillColor('#333333').text('Customer Details:', 300, customerTop);
            doc.fontSize(10).fillColor('#555555')
                .text(invoiceData.customer_name, 300, customerTop + 20)
                .text(invoiceData.email || '', 300, customerTop + 35)
                .text(invoiceData.phone || '', 300, customerTop + 50)
                .text(invoiceData.address || '', 300, customerTop + 65, { width: 250 });

            doc.moveDown(4);

            // ─── Products Table ─────────────────────────────────────────────────
            const invoiceTableTop = doc.y + 10;

            doc.font('Helvetica-Bold');
            generateTableRow(doc, invoiceTableTop, 'Product Name', 'Unit Price', 'Qty', 'Total Price');
            generateHr(doc, invoiceTableTop + 20);
            doc.font('Helvetica');

            let i = 0;
            let currentY = invoiceTableTop + 30;

            const items = invoiceData.items || [];

            for (i = 0; i < items.length; i++) {
                const item = items[i];
                generateTableRow(
                    doc,
                    currentY,
                    item.name || item.product_name,
                    `Rs ${Number(item.price).toFixed(2)}`,
                    item.quantity.toString(),
                    `Rs ${(Number(item.price) * Number(item.quantity)).toFixed(2)}`
                );
                currentY += 20; // Move down for next row
            }

            generateHr(doc, currentY + 10);

            // ─── Payment Summary ────────────────────────────────────────────────
            const summaryTop = currentY + 30;

            doc.font('Helvetica-Bold')
                .text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' })
                .text(`Rs ${Number(invoiceData.subtotal).toFixed(2)}`, 450, summaryTop, { width: 90, align: 'right' });

            doc.text('Delivery Charge:', 350, summaryTop + 20, { width: 100, align: 'right' })
                .text(`Rs ${Number(invoiceData.delivery_charge || 0).toFixed(2)}`, 450, summaryTop + 20, { width: 90, align: 'right' });

            doc.text('Discount:', 350, summaryTop + 40, { width: 100, align: 'right' })
                .text(`-Rs ${Number(invoiceData.discount || 0).toFixed(2)}`, 450, summaryTop + 40, { width: 90, align: 'right' });

            doc.text('GST / Tax:', 350, summaryTop + 60, { width: 100, align: 'right' })
                .text(`Rs ${Number(invoiceData.tax || 0).toFixed(2)}`, 450, summaryTop + 60, { width: 90, align: 'right' });

            doc.fontSize(14).fillColor('#8B4513')
                .text('Grand Total:', 320, summaryTop + 85, { width: 130, align: 'right' })
                .text(`Rs ${Number(invoiceData.grand_total || invoiceData.total_amount).toFixed(2)}`, 450, summaryTop + 85, { width: 90, align: 'right' });

            // ─── Footer ─────────────────────────────────────────────────────────
            doc.font('Helvetica').fontSize(10).fillColor('#888888');
            const footerY = doc.page.height - 100;
            generateHr(doc, footerY - 15);
            doc.text(
                'Thank you for shopping with Cookie Heaven!',
                50,
                footerY,
                { align: 'center', width: 500 }
            );
            doc.text(
                'Website: www.cookieheaven.com | Email: support@cookieheaven.com | Phone: +91 9876543210',
                50,
                footerY + 20,
                { align: 'center', width: 500 }
            );

            // Finalize PDF file
            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => reject(err));
        } catch (error) {
            reject(error);
        }
    });
};

function generateHr(doc, y) {
    doc.strokeColor('#dddddd').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function generateTableRow(doc, y, desc, unitCost, qty, lineTotal) {
    doc.fontSize(10)
        .text(desc, 50, y)
        .text(unitCost, 280, y, { width: 90, align: 'right' })
        .text(qty, 370, y, { width: 90, align: 'right' })
        .text(lineTotal, 0, y, { align: 'right' });
}
