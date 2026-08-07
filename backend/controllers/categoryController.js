import pool from '../config/db.js';
import { runSeeding } from '../scripts/seed-api.js';

export const seedData = async (req, res) => {
    const result = await runSeeding();
    res.json(result);
};

export async function getAll(req, res) {
    try {
        const [rows] = await pool.query('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) AS product_count FROM categories c ORDER BY c.display_order ASC, c.category_name ASC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getById(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function create(req, res) {
    try {
        const { category_name, category_slug, description, display_order, status } = req.body;
        if (!category_name) return res.status(400).json({ error: 'Category name is required' });

        const category_image = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await pool.query(
            'INSERT INTO categories (category_name, category_slug, category_image, description, display_order, status) VALUES (?, ?, ?, ?, ?, ?)',
            [category_name, category_slug || null, category_image, description || null, display_order || 0, status || 'Active']
        );
        const [cat] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
        res.status(201).json(cat[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function update(req, res) {
    try {
        const { category_name, category_slug, description, display_order, status } = req.body;

        let sql = 'UPDATE categories SET category_name=?, category_slug=?, description=?, display_order=?, status=?';
        const params = [category_name, category_slug || null, description || null, display_order || 0, status || 'Active'];

        if (req.file) {
            sql += ', category_image=?';
            params.push(`/uploads/${req.file.filename}`);
        }

        sql += ' WHERE id=?';
        params.push(req.params.id);

        await pool.query(sql, params);
        const [cat] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        res.json(cat[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function remove(req, res) {
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Category deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
}
