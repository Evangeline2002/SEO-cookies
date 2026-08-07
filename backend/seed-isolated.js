import 'dotenv/config';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cookie_heaven',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 1
};

const menuData = [
    {
        name: "Cookies",
        description: "Freshly baked handmade cookies made with premium ingredients.",
        products: ["Classic Chocolate Chip Cookie", "Double Chocolate Cookie", "Triple Chocolate Cookie", "Belgian Chocolate Cookie", "White Chocolate Cookie", "Dark Chocolate Cookie", "Butter Cookie", "Red Velvet Cookie", "Oreo Cookie", "Nutella Cookie", "Peanut Butter Cookie", "Oatmeal Cookie", "Coconut Cookie", "Almond Cookie", "Pistachio Cookie", "Walnut Cookie", "Coffee Cookie", "Matcha Cookie", "Salted Caramel Cookie", "Cookies & Cream Cookie"]
    },
    {
        name: "Brownies",
        description: "Rich, fudgy brownies baked fresh every day.",
        products: ["Classic Brownie", "Fudge Brownie", "Double Chocolate Brownie", "Triple Chocolate Brownie", "Walnut Brownie", "Almond Brownie", "Hazelnut Brownie", "Oreo Brownie", "Nutella Brownie", "Peanut Butter Brownie", "White Chocolate Brownie", "Salted Caramel Brownie", "Red Velvet Brownie", "Brownie Bites", "Brownie Gift Box", "Assorted Brownie Box"]
    },
    {
        name: "Cupcakes",
        description: "Soft and delicious cupcakes with creamy frosting.",
        products: ["Vanilla Cupcake", "Chocolate Cupcake", "Red Velvet Cupcake", "Oreo Cupcake", "Nutella Cupcake", "Strawberry Cupcake", "Blueberry Cupcake", "Coffee Cupcake", "Rainbow Cupcake", "Caramel Cupcake"]
    },
    {
        name: "Muffins",
        description: "Moist and fluffy muffins baked fresh daily.",
        products: ["Chocolate Muffin", "Blueberry Muffin", "Banana Muffin", "Vanilla Muffin", "Coffee Muffin", "Walnut Muffin", "Double Chocolate Muffin", "Apple Cinnamon Muffin"]
    },
    {
        name: "Donuts",
        description: "Fresh donuts with delicious toppings and fillings.",
        products: ["Chocolate Donut", "Glazed Donut", "Strawberry Donut", "Oreo Donut", "Nutella Donut", "Vanilla Donut", "Caramel Donut", "Sprinkle Donut"]
    },
    {
        name: "Cakes",
        description: "Premium celebration cakes for every occasion.",
        products: ["Chocolate Cake", "Black Forest Cake", "White Forest Cake", "Red Velvet Cake", "Vanilla Cake", "Butterscotch Cake", "Strawberry Cake", "Blueberry Cake", "Fruit Cake", "Coffee Cake"]
    },
    {
        name: "Cheesecakes",
        description: "Creamy cheesecakes with rich flavors.",
        products: ["New York Cheesecake", "Blueberry Cheesecake", "Strawberry Cheesecake", "Chocolate Cheesecake", "Oreo Cheesecake", "Lotus Biscoff Cheesecake"]
    },
    {
        name: "Desserts",
        description: "Premium desserts made with fresh ingredients.",
        products: ["Chocolate Truffle", "Chocolate Mousse", "Tiramisu", "Lava Cake", "Fruit Tart", "Chocolate Tart", "Macarons", "Éclairs", "Mini Pastries", "Pudding"]
    },
    {
        name: "Gift Boxes",
        description: "Beautifully packed bakery gift boxes for every celebration.",
        products: ["Cookie Gift Box", "Brownie Gift Box", "Premium Gift Box", "Family Gift Box", "Birthday Gift Box", "Anniversary Gift Box", "Corporate Gift Box", "Festival Gift Box", "Wedding Gift Box", "Celebration Box"]
    },
    {
        name: "Healthy Collection",
        description: "Healthy baked treats made with wholesome ingredients.",
        products: ["Oats Cookie", "Multigrain Cookie", "Sugar-Free Cookie", "Gluten-Free Cookie", "Vegan Cookie", "Protein Cookie", "Keto Cookie"]
    },
    {
        name: "Beverages",
        description: "Hot and cold drinks to pair with your desserts.",
        products: ["Espresso", "Americano", "Cappuccino", "Latte", "Mocha", "Hot Chocolate", "Cold Coffee", "Iced Latte", "Milkshake", "Fresh Juice"]
    },
    {
        name: "Best Sellers",
        description: "Customer favorites and most popular bakery items.",
        products: ["Double Chocolate Cookie", "Belgian Chocolate Cookie", "Oreo Cookie", "Nutella Cookie", "Fudge Brownie", "Red Velvet Cupcake", "Chocolate Muffin", "Chocolate Donut", "Premium Gift Box", "Lotus Biscoff Cheesecake"],
        best_seller: true
    },
    {
        name: "New Arrivals",
        description: "Latest bakery creations and seasonal specials.",
        products: ["Dubai Chocolate Cookie", "Lotus Biscoff Cookie", "Pistachio Cookie", "Matcha Cookie", "S'mores Cookie", "Cookies & Cream Brownie", "Premium Assorted Gift Box", "Belgian Chocolate Brownie", "Caramel Crunch Cookie", "Signature Celebration Box"],
        new_arrival: true
    }
];

async function seedData() {
    let conn;
    try {
        console.log('Connecting to DB directly (Single Connection)...');
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected natively!');

        console.log('Starting Seeding Process...');

        for (const data of menuData) {
            const [catRows] = await conn.query('SELECT id FROM categories WHERE category_name = ?', [data.name]);
            let catId = null;

            if (catRows.length > 0) {
                catId = catRows[0].id;
                console.log(`Category ${data.name} already exists (ID: ${catId}).`);
            } else {
                console.log(`Inserting Category: ${data.name}`);
                const [result] = await conn.query(
                    'INSERT INTO categories (category_name, description, status) VALUES (?, ?, ?)',
                    [data.name, data.description, 'Active']
                );
                catId = result.insertId;
            }

            const products = data.products;
            for (const prodName of products) {
                const [prodRows] = await conn.query('SELECT id FROM products WHERE product_name = ? AND category_id = ?', [prodName, catId]);

                if (prodRows.length === 0) {
                    await conn.query(
                        `INSERT INTO products (
                            product_name, category_id, short_description, price, offer_price, stock, status, best_seller, new_arrival
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            prodName,
                            catId,
                            data.description,
                            99.00,
                            99.00,
                            100,
                            'Active',
                            data.best_seller ? 1 : 0,
                            data.new_arrival ? 1 : 0
                        ]
                    );
                    process.stdout.write('.');
                }
            }
            console.log(`\n✅ Processed ${products.length} products for ${data.name}.`);
        }

        console.log('✅ Seeding Completeted Succesfully.');
    } catch (e) {
        console.error('Failed to seed:', e);
    } finally {
        if (conn) await conn.end();
        process.exit();
    }
}

seedData();
