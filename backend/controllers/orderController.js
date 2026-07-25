import pool from '../config/db.js';

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
        const { order_number, customer_name, email, phone, address, payment_method, total_amount, items } = req.body;

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const [result] = await conn.query(
            `INSERT INTO orders (order_number, customer_name, email, phone, address, payment_method, total_amount, order_status, payment_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', 'Pending')`,
            [order_number, customer_name, email || '', phone || '', address || '', payment_method || 'Cash on Delivery', total_amount]
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

        await conn.commit();
        res.status(201).json({ id: orderId, order_number });
    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
}

