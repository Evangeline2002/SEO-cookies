import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';

import chocolateChipImg from '../assets/Chocolate_Chip_Classic_Cookie.jpg';
import healthyVeganImg from '../assets/oats honey cookies.jpg';
import giftBoxesImg from '../assets/Luxury Gourmet Box.webp';
import assortedCombosImg from '../assets/mixed_nuts_cookies.jpg';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
    const { addToCart } = useCart();
    const [categories, setCategories] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const imgBaseUrl = api.defaults.baseURL.replace('/api', '');

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products')
                ]);
                const giftCategories = catRes.data.filter(c => c.status === 'Active' && (c.category_name.toLowerCase().includes('gift') || c.category_name.toLowerCase().includes('combo') || c.category_name.toLowerCase().includes('box') || c.category_name.toLowerCase().includes('healthy') || c.category_name.toLowerCase().includes('dessert')));
                setCategories(giftCategories.length > 0 ? giftCategories.slice(0, 4) : catRes.data.filter(c => c.status === 'Active').slice(0, 4));
                setBestSellers(prodRes.data.filter(p => p.status === 'Active' && p.best_seller).slice(0, 4));
            } catch (err) {
                console.error("Error fetching home data:", err);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <main className="min-h-screen overflow-hidden">
            <SEO
                title="Cookie Heaven | Freshly Baked Premium Cookies"
                description="Discover freshly baked cookies made with premium ingredients. Shop chocolate chip, double chocolate, butter cookies, brownies, and more with fast delivery."
                keywords="Cookie Heaven, Fresh Cookies, Premium Cookies, Chocolate Chip Cookies, Buy Cookies Online, Bakery"
                canonical="https://www.cookieheaven.com/"
            />

            <HeroSection />

            {/* 2. Featured Categories */}
            <section className="py-20 px-4 bg-white relative">
                <div className="container mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#8b4513] mb-4 font-['Poppins']">Find Your Perfect Treat</h2>
                        <p className="text-gray-500 text-lg">The gifts and combos collections only</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link to={`/shop?cat=${encodeURIComponent(cat.category_name)}`} className="group block h-full">
                                    <div className="bg-[#FFFDF9] rounded-[24px] p-5 lg:p-6 text-center h-full flex flex-col items-center border border-[#F2E8DB] hover:shadow-xl transition-all duration-300">
                                        <div className="w-full aspect-square overflow-hidden rounded-2xl mb-5 flex items-center justify-center bg-white shadow-sm border border-gray-50">
                                            {cat.category_image ? (
                                                <img
                                                    src={`${imgBaseUrl}${cat.category_image}`}
                                                    alt={cat.category_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-6xl">🍪</span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-[#1E293B] text-lg md:text-xl mb-3 leading-snug">{cat.category_name}</h3>
                                        <span className="text-[#E07A5F] font-bold text-sm tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all mt-auto pb-1">
                                            View All <span className="font-normal">→</span>
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Best Sellers */}
            <section className="py-24 px-4 bg-[var(--color-background)]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="section-title mb-2">Our Best Sellers</h2>
                            <p className="text-lg text-gray-600">The cookies everyone is talking about</p>
                        </div>
                        <Link to="/shop?type=bestsellers" className="text-[var(--color-primary)] font-bold hover:text-[var(--color-secondary)] flex items-center gap-2 transition-colors">
                            View Entire Menu <FiArrowRight />
                        </Link>
                    </div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {bestSellers.map(product => (
                            <motion.div key={product.id} variants={fadeIn} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative flex flex-col h-full">
                                {product.new_arrival && (
                                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-full text-white bg-[var(--color-secondary)]">
                                        NEW
                                    </span>
                                )}

                                <div className="bg-[#FFFDF8] rounded-2xl h-48 mb-6 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                                    {product.product_image ? (
                                        <img src={`${imgBaseUrl}${product.product_image}`} alt={`${product.product_name} cookie`} loading="lazy" className="w-full h-full object-cover !scale-100" />
                                    ) : (
                                        <span>🍪</span>
                                    )}
                                </div>

                                <h3 className="font-bold text-xl text-[var(--color-text)] mb-2 leading-tight">
                                    <Link to={`/product/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                                        {product.product_name}
                                    </Link>
                                </h3>

                                <div className="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                                    <FiStar className="fill-current" />
                                    <span className="text-gray-600 font-medium ml-1">{product.rating || 5} ({product.reviews || 0})</span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 line-through">
                                            {product.offer_price ? `₹${product.price}` : ''}
                                        </span>
                                        <span className="font-bold text-2xl text-[var(--color-primary)] flex items-baseline gap-1">
                                            ₹{product.offer_price || product.price} <span className="text-sm text-gray-500 font-normal">/ box</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                                        aria-label={`Add ${product.product_name} to cart`}
                                    >
                                        <span className="text-xl">+</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. Why Choose Us */}
            <section className="py-24 px-4 bg-white text-center">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="section-title text-center mb-16">Why Cookie Heaven?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Baked Fresh Daily", desc: "Every batch is baked early morning to ensure maximum freshness and taste upon delivery.", icon: "👨‍🍳" },
                            { title: "Premium Ingredients", desc: "We use only the finest Belgian chocolate, pure butter, and organic flours.", icon: "🍫" },
                            { title: "Eco-Friendly Packaging", desc: "Our beautiful gift boxes are 100% recyclable and eco-friendly.", icon: "📦" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-[#FFFDF8] flex items-center justify-center text-4xl mb-6 shadow-inner border border-yellow-100">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed max-w-xs">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hidden SEO content */}
            <section className="sr-only">
                <h2>Freshly Baked Cookies Online</h2>
                <p>
                    Cookie Heaven offers freshly baked cookies made with premium ingredients.
                    Enjoy chocolate chip cookies, double chocolate cookies, butter cookies,
                    brownies, and delicious treats delivered fresh to your doorstep.
                </p>
            </section>

        </main>
    );
}
