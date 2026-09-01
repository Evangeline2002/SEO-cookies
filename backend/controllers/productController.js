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

        // Remove massive binary blobs from general list payload to save bandwidth
        const cleanRows = rows.map(r => {
            if (r.image_data) {
                delete r.image_data;
                r.has_image = true;
            }
            return r;
        });

        res.json(cleanRows);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getById(req, res) {
    try {
        const [rows] = await pool.query('SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        // Remove raw binary data before sending JSON
        const product = rows[0];
        if (product.image_data) {
            delete product.image_data;
            product.has_image = true; // flag to frontend that image exists
        }

        res.json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getImage(req, res) {
    try {
        const [rows] = await pool.query('SELECT image_data, image_type FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0 || !rows[0].image_data) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const { image_data, image_type } = rows[0];
        res.set('Content-Type', image_type || 'image/jpeg');
        res.send(image_data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getByCategory(req, res) {
    try {
        const [rows] = await pool.query('SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.status = "Active" ORDER BY p.created_at DESC', [req.params.categoryId]);

        // Strip image binary
        const cleanRows = rows.map(r => {
            if (r.image_data) {
                delete r.image_data;
                r.has_image = true;
            }
            return r;
        });

        res.json(cleanRows);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function create(req, res) {
    try {
        const { product_name, category_id, product_slug, short_description, description, price, offer_price, stock, sku, weight, ingredients, tags, best_seller, featured, new_arrival, status } = req.body;

        let image_data = null;
        let image_name = null;
        let image_type = null;

        if (req.file) {
            image_data = req.file.buffer;
            image_name = req.file.originalname;
            image_type = req.file.mimetype;
        }

        const [result] = await pool.query(
            'INSERT INTO products (product_name, category_id, product_slug, short_description, description, price, offer_price, stock, sku, weight, ingredients, tags, best_seller, featured, new_arrival, status, image_data, image_name, image_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_name, category_id || null, product_slug || null, short_description || null, description || null, price, offer_price || null, stock || 0, sku || null, weight || null, ingredients || null, tags || null, best_seller === 'true' || best_seller === true ? 1 : 0, featured === 'true' || featured === true ? 1 : 0, new_arrival === 'true' || new_arrival === true ? 1 : 0, status || 'Active', image_data, image_name, image_type]
        );
        const [product] = await pool.query('SELECT id, product_name FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(product[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function update(req, res) {
    try {
        const { product_name, category_id, product_slug, short_description, description, price, offer_price, stock, sku, weight, ingredients, tags, best_seller, featured, new_arrival, status } = req.body;

        let sql = 'UPDATE products SET product_name=?, category_id=?, product_slug=?, short_description=?, description=?, price=?, offer_price=?, stock=?, sku=?, weight=?, ingredients=?, tags=?, best_seller=?, featured=?, new_arrival=?, status=?';
        const params = [product_name, category_id || null, product_slug || null, short_description || null, description || null, price, offer_price || null, stock || 0, sku || null, weight || null, ingredients || null, tags || null, best_seller === 'true' || best_seller === true ? 1 : 0, featured === 'true' || featured === true ? 1 : 0, new_arrival === 'true' || new_arrival === true ? 1 : 0, status || 'Active'];

        if (req.file) {
            sql += ', image_data=?, image_name=?, image_type=?';
            params.push(req.file.buffer, req.file.originalname, req.file.mimetype);
        }

        sql += ' WHERE id=?';
        params.push(req.params.id);

        await pool.query(sql, params);
        const [product] = await pool.query('SELECT id, product_name FROM products WHERE id = ?', [req.params.id]);
        res.json(product[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function remove(req, res) {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
}
