import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { bestSellers } from '../utils/productData';
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
                    <div className="text-center mb-16">
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-subtitle">Find your perfect sweet treat from our premium collections</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {[
                            { label: 'Chocolate Chip', img: chocolateChipImg, to: '/shop' },
                            { label: 'Healthy & Vegan', img: healthyVeganImg, to: '/shop?type=healthy' },
                            { label: 'Premium Gift Boxes', img: giftBoxesImg, to: '/gift-boxes' },
                            { label: 'Assorted Combos', img: assortedCombosImg, to: '/shop' },
                        ].map((cat, i) => (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link to={cat.to} className="group block h-full">
                                    <div className="bg-[var(--color-background)] rounded-3xl p-4 md:p-6 text-center h-full flex flex-col items-center gap-4 border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                                        <div className="w-full h-36 sm:h-44 md:h-48 overflow-hidden rounded-2xl bg-gray-50 border border-[var(--color-primary)]/5">
                                            <img
                                                src={cat.img}
                                                alt={cat.label}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-base md:text-lg leading-snug">{cat.label}</h3>
                                        <span className="text-[var(--color-secondary)] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                                            View All <FiArrowRight />
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
                        {bestSellers.slice(0, 4).map(product => (
                            <motion.div key={product.id} variants={fadeIn} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative flex flex-col h-full">
                                {product.badge && (
                                    <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-full text-white ${product.badge === 'hot' ? 'bg-red-500' : 'bg-[var(--color-secondary)]'}`}>
                                        {product.badge}
                                    </span>
                                )}

                                <div className="bg-[var(--color-background)] rounded-2xl h-48 mb-6 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                                    {product.img ? (
                                        <img src={product.img} alt={`${product.name} cookie`} loading="lazy" className="w-full h-full object-cover !scale-100" />
                                    ) : (
                                        product.emoji
                                    )}
                                </div>

                                <h3 className="font-bold text-xl text-[var(--color-text)] mb-2 leading-tight">
                                    <Link to={`/product/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                                        {product.name}
                                    </Link>
                                </h3>

                                <div className="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                                    <FiStar className="fill-current" />
                                    <span className="text-gray-600 font-medium ml-1">{product.rating} ({product.reviews})</span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 line-through">
                                            {product.originalPrice ? `₹${product.originalPrice}` : ''}
                                        </span>
                                        <span className="font-bold text-2xl text-[var(--color-primary)] flex items-baseline gap-1">
                                            ₹{product.price} <span className="text-sm text-gray-500 font-normal">/ box</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                                        aria-label={`Add ${product.name} to cart`}
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
