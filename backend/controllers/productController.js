import pool from '../config/db.js';

export async function getAll(req, res) {
    try {
        const { search, category, status } = req.query;
        let sql = 'SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
        const params = [];

        if (search) { sql += ' AND p.product_name LIKE ?'; params.push(`%${search}%`); }
        if (category) { sql += ' AND p.category_id = ?'; params.push(category); }
        if (status) { sql += ' AND p.status = ?'; params.push(status); }

        sql += ' ORDER BY p.created_at DESC';

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getById(req, res) {
    try {
        const [rows] = await pool.query('SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getByCategory(req, res) {
    try {
        const [rows] = await pool.query('SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.status = "Active" ORDER BY p.created_at DESC', [req.params.categoryId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function create(req, res) {
    try {
        const { product_name, category_id, product_slug, short_description, description, price, offer_price, stock, sku, weight, ingredients, tags, best_seller, featured, new_arrival, status } = req.body;
        const product_image = req.file ? req.file.filename : null;

        const [result] = await pool.query(
            'INSERT INTO products (product_name, category_id, product_slug, product_image, short_description, description, price, offer_price, stock, sku, weight, ingredients, tags, best_seller, featured, new_arrival, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_name, category_id || null, product_slug || null, product_image, short_description || null, description || null, price, offer_price || null, stock || 0, sku || null, weight || null, ingredients || null, tags || null, best_seller || false, featured || false, new_arrival || false, status || 'Active']
        );
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(product[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function update(req, res) {
    try {
        const { product_name, category_id, product_slug, short_description, description, price, offer_price, stock, sku, weight, ingredients, tags, best_seller, featured, new_arrival, status } = req.body;

        let sql = 'UPDATE products SET product_name=?, category_id=?, product_slug=?, short_description=?, description=?, price=?, offer_price=?, stock=?, sku=?, weight=?, ingredients=?, tags=?, best_seller=?, featured=?, new_arrival=?, status=?';
        const params = [product_name, category_id || null, product_slug || null, short_description || null, description || null, price, offer_price || null, stock || 0, sku || null, weight || null, ingredients || null, tags || null, best_seller || false, featured || false, new_arrival || false, status || 'Active'];

        if (req.file) {
            sql += ', product_image=?';
            params.push(req.file.filename);
        }

        sql += ' WHERE id=?';
        params.push(req.params.id);

        await pool.query(sql, params);
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(product[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function remove(req, res) {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
}
