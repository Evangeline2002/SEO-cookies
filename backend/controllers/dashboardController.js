import pool from '../config/db.js';

export async function getStats(req, res) {
    try {
        const [productCount] = await pool.query('SELECT COUNT(*) AS count FROM products');
        const [orderCount] = await pool.query('SELECT COUNT(*) AS count FROM orders');
        const [customerCount] = await pool.query('SELECT COUNT(*) AS count FROM customers');
        const [revenueResult] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE order_status != "Cancelled"');

        // Recent Orders with items string
        const [recentOrdersRows] = await pool.query('SELECT id, order_number, customer_name, email, phone, total_amount, payment_method, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5');
        const recentOrders = await Promise.all(recentOrdersRows.map(async (order) => {
            const [items] = await pool.query('SELECT product_name, quantity FROM order_items WHERE order_id = ?', [order.id]);
            const productName = items.length > 0 ? (items.length === 1 ? items[0].product_name : `${items[0].product_name} + ${items.length - 1} more`) : '-';
            const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
            return { ...order, product_name: productName, quantity: totalQty };
        }));

        const [recentCustomers] = await pool.query('SELECT id, name, email, phone, total_orders, created_at FROM customers ORDER BY created_at DESC LIMIT 5');

        // Latest Products
        const [latestProducts] = await pool.query('SELECT p.id, p.name, p.image, p.price, p.stock, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT 5');

        // Order Status Summary
        const [orderStatusSummaryRaw] = await pool.query('SELECT order_status, COUNT(*) as count FROM orders GROUP BY order_status');
        const orderStatusSummary = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        orderStatusSummaryRaw.forEach(row => {
            if (orderStatusSummary[row.order_status] !== undefined) {
                orderStatusSummary[row.order_status] = row.count;
            }
        });

        // Analytics: Best Sellers
        const [bestSellers] = await pool.query('SELECT oi.product_name as name, SUM(oi.quantity) AS value FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.order_status != "Cancelled" GROUP BY oi.product_name ORDER BY value DESC LIMIT 5');

        // Analytics: Monthly Orders & Revenue
        const [monthlyAnalytics] = await pool.query('SELECT DATE_FORMAT(created_at, "%b %Y") AS month, COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS revenue FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY DATE_FORMAT(created_at, "%Y-%m"), month ORDER BY DATE_FORMAT(created_at, "%Y-%m")');

        // Analytics: Customer Growth
        const [customerGrowth] = await pool.query('SELECT DATE_FORMAT(created_at, "%b %Y") AS month, COUNT(*) AS customers FROM customers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY DATE_FORMAT(created_at, "%Y-%m"), month ORDER BY DATE_FORMAT(created_at, "%Y-%m")');

        res.json({
            totalProducts: productCount[0].count,
            totalOrders: orderCount[0].count,
            totalCustomers: customerCount[0].count,
            totalRevenue: revenueResult[0].total,
            recentOrders,
            recentCustomers,
            latestProducts,
            orderStatusSummary,
            analytics: {
                bestSellers,
                monthly: monthlyAnalytics,
                customerGrowth
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
