import bcrypt from 'bcryptjs';
import pool from './config/db.js';

async function seed() {
    try {
        console.log('Seeding database...');

        // ── Admin ──────────────────────────────────────────────────────────────
        const [adminExists] = await pool.query('SELECT COUNT(*) AS count FROM admins');
        if (adminExists[0].count === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
                ['Admin', 'admin@cookieheaven.com', hashedPassword]
            );
            console.log('✔ Admin seeded: admin@cookieheaven.com / admin123');
        } else {
            console.log('– Admin already exists, skipping.');
        }

        // ── Categories ─────────────────────────────────────────────────────────
        const [catExists] = await pool.query('SELECT COUNT(*) AS count FROM categories');
        if (catExists[0].count === 0) {
            const defaultCategories = [
                'Classic Cookies',
                'Chocolate Cookies',
                'Seasonal Specials',
                'Gift Collections',
                'Gluten Free',
            ];
            for (const name of defaultCategories) {
                await pool.query('INSERT INTO categories (name, status) VALUES (?, ?)', [name, 'Active']);
            }
            console.log(`✔ ${defaultCategories.length} default categories seeded.`);
        } else {
            console.log('– Categories already exist, skipping.');
        }

        // ── SEO Settings ───────────────────────────────────────────────────────
        const [seoExists] = await pool.query('SELECT COUNT(*) AS count FROM seo_settings');
        if (seoExists[0].count === 0) {
            const pages = [
                { page: 'home', title: 'Cookie Heaven | Freshly Baked Premium Cookies', desc: 'Discover freshly baked cookies made with premium ingredients.' },
                { page: 'about', title: 'About Cookie Heaven | Our Story', desc: 'Learn about our journey of baking premium cookies.' },
                { page: 'shop', title: 'Shop Cookies | Cookie Heaven', desc: 'Browse our collection of gourmet cookies.' },
                { page: 'recipes', title: 'Cookie Recipes | Cookie Heaven', desc: 'Discover our favorite cookie recipes.' },
                { page: 'gift-boxes', title: 'Gift Boxes | Cookie Heaven', desc: 'Beautiful gift boxes for every occasion.' },
                { page: 'contact', title: 'Contact Us | Cookie Heaven', desc: 'Get in touch with Cookie Heaven.' },
            ];
            for (const p of pages) {
                await pool.query(
                    'INSERT INTO seo_settings (page, meta_title, meta_description) VALUES (?, ?, ?)',
                    [p.page, p.title, p.desc]
                );
            }
            console.log(`✔ ${pages.length} SEO settings seeded.`);
        } else {
            console.log('– SEO settings already exist, skipping.');
        }

        // ── Website Settings ───────────────────────────────────────────────────
        const [settingsExists] = await pool.query('SELECT COUNT(*) AS count FROM website_settings');
        if (settingsExists[0].count === 0) {
            await pool.query(
                `INSERT INTO website_settings (site_name, tagline, contact_email, contact_phone, address)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    'Cookie Heaven',
                    'Where every cookie tells a story',
                    'hello@cookieheaven.com',
                    '(555) 123-4567',
                    '123 Bakery Lane, Sweet Town, ST 12345',
                ]
            );
            console.log('✔ Website settings seeded.');
        } else {
            console.log('– Website settings already exist, skipping.');
        }

        console.log('\nDatabase seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
