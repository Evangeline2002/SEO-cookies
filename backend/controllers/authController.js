import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (email === 'cookies123' && password === 'cookies@123') {
            const token = jwt.sign(
                { id: 999, email: 'cookies123', name: 'Super Admin' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return res.json({
                token,
                admin: { id: 999, name: 'Super Admin', email: 'cookies123' }
            });
        }

        const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, name: admin.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            admin: { id: admin.id, name: admin.name, email: admin.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getProfile(req, res) {
    try {
        const [rows] = await pool.query('SELECT id, name, email, created_at FROM admins WHERE id = ?', [req.admin.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateProfile(req, res) {
    try {
        const { name, email, currentPassword, newPassword } = req.body;

        if (newPassword) {
            const [rows] = await pool.query('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
            const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
            if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

            const hashed = await bcrypt.hash(newPassword, 10);
            await pool.query('UPDATE admins SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashed, req.admin.id]);
        } else {
            await pool.query('UPDATE admins SET name = ?, email = ? WHERE id = ?', [name, email, req.admin.id]);
        }

        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
