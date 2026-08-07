-- SEO-cookies Categories & Products Initial Seed File
-- IMPORTANT: Import this file directly into your phpMyAdmin dashboard on filess.io to bypass the 5-connection Node.js limit.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- Insert Categories
INSERT IGNORE INTO `categories` (`id`, `category_name`, `description`, `status`) VALUES
(1, 'Cookies', 'Freshly baked handmade cookies made with premium ingredients.', 'Active'),
(2, 'Brownies', 'Rich, fudgy brownies baked fresh every day.', 'Active'),
(3, 'Cupcakes', 'Soft and delicious cupcakes with creamy frosting.', 'Active'),
(4, 'Muffins', 'Moist and fluffy muffins baked fresh daily.', 'Active'),
(5, 'Donuts', 'Fresh donuts with delicious toppings and fillings.', 'Active'),
(6, 'Cakes', 'Premium celebration cakes for every occasion.', 'Active'),
(7, 'Cheesecakes', 'Creamy cheesecakes with rich flavors.', 'Active'),
(8, 'Desserts', 'Premium desserts made with fresh ingredients.', 'Active'),
(9, 'Gift Boxes', 'Beautifully packed bakery gift boxes for every celebration.', 'Active'),
(10, 'Healthy Collection', 'Healthy baked treats made with wholesome ingredients.', 'Active'),
(11, 'Beverages', 'Hot and cold drinks to pair with your desserts.', 'Active');

-- Insert Best Sellers & New Arrivals as pseudo-categories for UI mapping if desired
INSERT IGNORE INTO `categories` (`id`, `category_name`, `description`, `status`) VALUES
(12, 'Best Sellers', 'Customer favorites and most popular bakery items.', 'Active'),
(13, 'New Arrivals', 'Latest bakery creations and seasonal specials.', 'Active');

-- Insert Products
INSERT IGNORE INTO `products` (`product_name`, `category_id`, `price`, `offer_price`, `stock`, `status`, `best_seller`, `new_arrival`) VALUES

-- Cookies (Category 1)
('Classic Chocolate Chip Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Double Chocolate Cookie', 1, 99.00, 99.00, 100, 'Active', 1, 0),
('Triple Chocolate Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Belgian Chocolate Cookie', 1, 99.00, 99.00, 100, 'Active', 1, 0),
('White Chocolate Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Dark Chocolate Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Butter Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Red Velvet Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Oreo Cookie', 1, 99.00, 99.00, 100, 'Active', 1, 0),
('Nutella Cookie', 1, 99.00, 99.00, 100, 'Active', 1, 0),
('Peanut Butter Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Oatmeal Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Coconut Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Almond Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Pistachio Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 1),
('Walnut Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Coffee Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Matcha Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 1),
('Salted Caramel Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Cookies & Cream Cookie', 1, 99.00, 99.00, 100, 'Active', 0, 0),
('Dubai Chocolate Cookie', 1, 149.00, 149.00, 100, 'Active', 0, 1),
('Lotus Biscoff Cookie', 1, 129.00, 129.00, 100, 'Active', 0, 1),
('S''mores Cookie', 1, 119.00, 119.00, 100, 'Active', 0, 1),
('Caramel Crunch Cookie', 1, 109.00, 109.00, 100, 'Active', 0, 1),

-- Brownies (Category 2)
('Classic Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Fudge Brownie', 2, 120.00, 120.00, 100, 'Active', 1, 0),
('Double Chocolate Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Triple Chocolate Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Walnut Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Almond Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Hazelnut Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Oreo Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Nutella Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Peanut Butter Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('White Chocolate Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Salted Caramel Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Red Velvet Brownie', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Brownie Bites', 2, 120.00, 120.00, 100, 'Active', 0, 0),
('Brownie Gift Box', 2, 499.00, 499.00, 100, 'Active', 0, 0),
('Assorted Brownie Box', 2, 499.00, 499.00, 100, 'Active', 0, 0),
('Cookies & Cream Brownie', 2, 149.00, 149.00, 100, 'Active', 0, 1),
('Belgian Chocolate Brownie', 2, 159.00, 159.00, 100, 'Active', 0, 1),

-- Cupcakes (Category 3)
('Vanilla Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Chocolate Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Red Velvet Cupcake', 3, 85.00, 85.00, 100, 'Active', 1, 0),
('Oreo Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Nutella Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Strawberry Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Blueberry Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Coffee Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Rainbow Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),
('Caramel Cupcake', 3, 85.00, 85.00, 100, 'Active', 0, 0),

-- Muffins (Category 4)
('Chocolate Muffin', 4, 75.00, 75.00, 100, 'Active', 1, 0),
('Blueberry Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),
('Banana Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),
('Vanilla Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),
('Coffee Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),
('Walnut Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),
('Double Chocolate Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),
('Apple Cinnamon Muffin', 4, 75.00, 75.00, 100, 'Active', 0, 0),

-- Donuts (Category 5)
('Chocolate Donut', 5, 60.00, 60.00, 100, 'Active', 1, 0),
('Glazed Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),
('Strawberry Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),
('Oreo Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),
('Nutella Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),
('Vanilla Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),
('Caramel Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),
('Sprinkle Donut', 5, 60.00, 60.00, 100, 'Active', 0, 0),

-- Cakes (Category 6)
('Chocolate Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Black Forest Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('White Forest Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Red Velvet Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Vanilla Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Butterscotch Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Strawberry Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Blueberry Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Fruit Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),
('Coffee Cake', 6, 800.00, 800.00, 10, 'Active', 0, 0),

-- Cheesecakes (Category 7)
('New York Cheesecake', 7, 250.00, 250.00, 100, 'Active', 0, 0),
('Blueberry Cheesecake', 7, 250.00, 250.00, 100, 'Active', 0, 0),
('Strawberry Cheesecake', 7, 250.00, 250.00, 100, 'Active', 0, 0),
('Chocolate Cheesecake', 7, 250.00, 250.00, 100, 'Active', 0, 0),
('Oreo Cheesecake', 7, 250.00, 250.00, 100, 'Active', 0, 0),
('Lotus Biscoff Cheesecake', 7, 250.00, 250.00, 100, 'Active', 1, 0),

-- Desserts (Category 8)
('Chocolate Truffle', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Chocolate Mousse', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Tiramisu', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Lava Cake', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Fruit Tart', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Chocolate Tart', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Macarons', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Éclairs', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Mini Pastries', 8, 150.00, 150.00, 100, 'Active', 0, 0),
('Pudding', 8, 150.00, 150.00, 100, 'Active', 0, 0),

-- Gift Boxes (Category 9)
('Cookie Gift Box', 9, 699.00, 699.00, 50, 'Active', 0, 0),
('Premium Gift Box', 9, 999.00, 999.00, 50, 'Active', 1, 0),
('Family Gift Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Birthday Gift Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Anniversary Gift Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Corporate Gift Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Festival Gift Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Wedding Gift Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Celebration Box', 9, 1299.00, 1299.00, 50, 'Active', 0, 0),
('Premium Assorted Gift Box', 9, 1499.00, 1499.00, 50, 'Active', 0, 1),
('Signature Celebration Box', 9, 1999.00, 1999.00, 50, 'Active', 0, 1),

-- Healthy Collection (Category 10)
('Oats Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),
('Multigrain Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),
('Sugar-Free Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),
('Gluten-Free Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),
('Vegan Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),
('Protein Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),
('Keto Cookie', 10, 120.00, 120.00, 100, 'Active', 0, 0),

-- Beverages (Category 11)
('Espresso', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Americano', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Cappuccino', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Latte', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Mocha', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Hot Chocolate', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Cold Coffee', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Iced Latte', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Milkshake', 11, 149.00, 149.00, 100, 'Active', 0, 0),
('Fresh Juice', 11, 149.00, 149.00, 100, 'Active', 0, 0);

COMMIT;
