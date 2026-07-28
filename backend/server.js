import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import { initDatabase } from './config/db-init.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import giftboxRoutes from './routes/giftboxes.js';
import recipeRoutes from './routes/recipes.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import reviewRoutes from './routes/reviews.js';
import seoRoutes from './routes/seo.js';
import settingRoutes from './routes/settings.js';
import invoiceRoutes from './routes/invoices.js';
import whatsappRoutes from './routes/whatsapp.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'public', 'invoices')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/giftboxes', giftboxRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Init DB and start server
async function init() {
    try {
        await pool.query('SELECT 1');
        console.log('MySQL connected');
        await initDatabase();
    } catch (err) {
        console.error('MySQL connection error:', err.message);
        process.exit(1);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

init();
