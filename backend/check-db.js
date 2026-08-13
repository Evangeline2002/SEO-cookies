import pool from './config/db.js';

async function check() {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        console.log("Tables:", tables);

        // Try selecting from orders
        const [orders] = await pool.query('DESCRIBE orders');
        console.log("Orders schema:", orders);

        // Try selecting from invoices
        const [invoices] = await pool.query('SHOW TABLES LIKE "invoices"');
        console.log("Invoices table exists?", invoices.length > 0);

        if (invoices.length === 0) {
            console.log("Creating invoices table...");
            await pool.query(`
                CREATE TABLE IF NOT EXISTS invoices (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    invoice_number VARCHAR(50),
                    order_id INT,
                    customer_name VARCHAR(100) NOT NULL,
                    email VARCHAR(100),
                    phone VARCHAR(20),
                    subtotal DECIMAL(10,2),
                    delivery_charge DECIMAL(10,2),
                    discount DECIMAL(10,2),
                    tax DECIMAL(10,2),
                    grand_total DECIMAL(10,2),
                    payment_method VARCHAR(50),
                    payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
                    pdf_path VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
                )
            `);
            console.log("Created invoices table.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        pool.end();
    }
}
check();
