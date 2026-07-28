import pool from './db.js';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
    const conn = await pool.getConnection();
    try {
        console.log('Initializing database tables...');

        // ── Create Tables ──────────────────────────────────────────────────────

        await conn.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                category_id INT,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                original_price DECIMAL(10,2),
                stock INT DEFAULT 0,
                image VARCHAR(255),
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                featured BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS gift_boxes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                items INT DEFAULT 0,
                price DECIMAL(10,2) NOT NULL,
                image VARCHAR(255),
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS recipes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                author VARCHAR(100),
                description TEXT,
                ingredients TEXT,
                instructions TEXT,
                image VARCHAR(255),
                status ENUM('Published', 'Draft') DEFAULT 'Draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE,
                phone VARCHAR(20),
                password VARCHAR(255),
                total_orders INT DEFAULT 0,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(20) NOT NULL UNIQUE,
                customer_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                postal_code VARCHAR(20),
                payment_method VARCHAR(50),
                payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
                order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
                total_amount DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_name VARCHAR(200),
                product_image VARCHAR(255),
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_number VARCHAR(50) NOT NULL UNIQUE,
                order_id INT,
                customer_name VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                phone VARCHAR(20),
                subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                payment_method VARCHAR(50),
                payment_status VARCHAR(50),
                pdf_path VARCHAR(255),
                invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
            )
        `);

        // ── Schema Migrations (safely add missing columns) ─────────────────────
        const DB_NAME = conn.config?.database || process.env.DB_NAME || 'cookie_heaven';

        const invoicesColumns = {
            subtotal: "ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00",
            delivery_charge: "ADD COLUMN delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00",
            discount: "ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0.00",
            tax: "ADD COLUMN tax DECIMAL(10,2) NOT NULL DEFAULT 0.00",
            grand_total: "ADD COLUMN grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00",
            invoice_date: "ADD COLUMN invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
        };

        for (const [col, ddl] of Object.entries(invoicesColumns)) {
            const [cols] = await conn.query(
                `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='invoices' AND COLUMN_NAME=?`,
                [DB_NAME, col]
            );
            if (cols.length === 0) {
                await conn.query(`ALTER TABLE invoices ${ddl}`);
                console.log(`✔ Migration: invoices.${col} added.`);
            }
        }

        const ordersColumns = {
            email: "ADD COLUMN email VARCHAR(100) NOT NULL DEFAULT ''",
            phone: "ADD COLUMN phone VARCHAR(20)",
            address: "ADD COLUMN address TEXT",
            city: "ADD COLUMN city VARCHAR(100)",
            state: "ADD COLUMN state VARCHAR(100)",
            postal_code: "ADD COLUMN postal_code VARCHAR(20)",
            payment_status: "ADD COLUMN payment_status ENUM('Pending','Paid','Failed','Refunded') DEFAULT 'Pending'",
            order_status: "ADD COLUMN order_status ENUM('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending'",
        };

        for (const [col, ddl] of Object.entries(ordersColumns)) {
            const [cols] = await conn.query(
                `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='orders' AND COLUMN_NAME=?`,
                [DB_NAME, col]
            );
            if (cols.length === 0) {
                await conn.query(`ALTER TABLE orders ${ddl}`);
                console.log(`✔ Migration: orders.${col} added.`);
            }
        }

        const orderItemsColumns = {
            product_image: "ADD COLUMN product_image VARCHAR(255)",
            subtotal: "ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00",
        };

        for (const [col, ddl] of Object.entries(orderItemsColumns)) {
            const [cols] = await conn.query(
                `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='order_items' AND COLUMN_NAME=?`,
                [DB_NAME, col]
            );
            if (cols.length === 0) {
                await conn.query(`ALTER TABLE order_items ${ddl}`);
                console.log(`✔ Migration: order_items.${col} added.`);
            }
        }

        await conn.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT,
                customer_name VARCHAR(100) NOT NULL,
                product_id INT,
                product_name VARCHAR(200),
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                status ENUM('Pending', 'Approved') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS seo_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page VARCHAR(50) NOT NULL UNIQUE,
                meta_title VARCHAR(200),
                meta_description TEXT,
                keywords TEXT,
                canonical_url VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS website_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                site_name VARCHAR(100) DEFAULT 'Cookie Heaven',
                tagline VARCHAR(200),
                logo VARCHAR(255),
                contact_email VARCHAR(100),
                contact_phone VARCHAR(20),
                address TEXT,
                facebook_url VARCHAR(255),
                instagram_url VARCHAR(255),
                twitter_url VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS whatsapp_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                invoice_number VARCHAR(50),
                customer_name VARCHAR(100) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                message_status ENUM('Pending', 'Sent', 'Delivered', 'Failed') DEFAULT 'Pending',
                message_id VARCHAR(255),
                invoice_url VARCHAR(500),
                sent_at TIMESTAMP NULL,
                delivered_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
            )
        `);

        // Migration: add message_id column if missing
        const [msgCol] = await conn.query(
            `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='whatsapp_logs' AND COLUMN_NAME='message_id'`,
            [DB_NAME]
        );
        if (msgCol.length === 0) {
            await conn.query('ALTER TABLE whatsapp_logs ADD COLUMN message_id VARCHAR(255) AFTER message_status');
            console.log('✔ Migration: whatsapp_logs.message_id added.');
        }

        console.log('✔ All tables created successfully.');

        // ── Seed Initial Data ──────────────────────────────────────────────────

        // Admin
        const [adminRows] = await conn.query('SELECT COUNT(*) AS count FROM admins');
        if (adminRows[0].count === 0) {
            const hashed = await bcrypt.hash('admin123', 10);
            await conn.query(
                'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
                ['Admin', 'admin@cookieheaven.com', hashed]
            );
            console.log('✔ Admin seeded: admin@cookieheaven.com / admin123');
        }

        // Categories
        const [catRows] = await conn.query('SELECT COUNT(*) AS count FROM categories');
        if (catRows[0].count === 0) {
            const cats = ['Classic Cookies', 'Chocolate Cookies', 'Seasonal Specials', 'Gift Collections', 'Gluten Free'];
            for (const name of cats) {
                await conn.query('INSERT INTO categories (name, status) VALUES (?, ?)', [name, 'Active']);
            }
            console.log('✔ Default categories seeded.');
        }

        // SEO Settings
        const [seoRows] = await conn.query('SELECT COUNT(*) AS count FROM seo_settings');
        if (seoRows[0].count === 0) {
            const pages = [
                { page: 'home', title: 'Cookie Heaven | Freshly Baked Premium Cookies', desc: 'Discover freshly baked cookies made with premium ingredients.' },
                { page: 'about', title: 'About Cookie Heaven | Our Story', desc: 'Learn about our journey of baking premium cookies.' },
                { page: 'shop', title: 'Shop Cookies | Cookie Heaven', desc: 'Browse our collection of gourmet cookies.' },
                { page: 'recipes', title: 'Cookie Recipes | Cookie Heaven', desc: 'Discover our favorite cookie recipes.' },
                { page: 'gift-boxes', title: 'Gift Boxes | Cookie Heaven', desc: 'Beautiful gift boxes for every occasion.' },
                { page: 'contact', title: 'Contact Us | Cookie Heaven', desc: 'Get in touch with Cookie Heaven.' },
            ];
            for (const p of pages) {
                await conn.query(
                    'INSERT INTO seo_settings (page, meta_title, meta_description) VALUES (?, ?, ?)',
                    [p.page, p.title, p.desc]
                );
            }
            console.log('✔ SEO settings seeded.');
        }

        // Website Settings
        const [settingsRows] = await conn.query('SELECT COUNT(*) AS count FROM website_settings');
        if (settingsRows[0].count === 0) {
            await conn.query(
                `INSERT INTO website_settings (site_name, tagline, contact_email, contact_phone, address)
                 VALUES (?, ?, ?, ?, ?)`,
                ['Cookie Heaven', 'Where every cookie tells a story', 'hello@cookieheaven.com', '(555) 123-4567', '123 Bakery Lane, Sweet Town, ST 12345']
            );
            console.log('✔ Website settings seeded.');
        }


        console.log('Database ready.');
    } catch (err) {
        console.error('Database init error:', err.message);
        throw err;
    } finally {
        conn.release();
    }
}
