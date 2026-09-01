import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';

import giftBoxesImg from '../assets/Premium Assorted Gift Box.jpg';
import comboBoxesImg from '../assets/family gift box.jpg';
import bakerySpecialsImg from '../assets/biscoff cheese cake.jpg';
import celebrationBoxesImg from '../assets/anniversary gift box.jpg';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const staticCategories = [
    {
        title: "GIFT BOXES",
        desc: "Beautifully packed treats made for gifting.",
        btn: "Explore Gifts →",
        img: giftBoxesImg,
        link: "/shop?category=gifts"
    },
    {
        title: "COMBO BOXES",
        desc: "A delicious collection of your favourite treats.",
        btn: "View Combos →",
        img: comboBoxesImg,
        link: "/shop?category=combos"
    },
    {
        title: "BAKERY SPECIALS",
        desc: "Freshly baked favourites for every occasion.",
        btn: "Explore Specials →",
        img: bakerySpecialsImg,
        link: "/shop?category=specials"
    },
    {
        title: "CELEBRATION BOXES",
        desc: "Make every celebration extra sweet.",
        btn: "Shop Celebration →",
        img: celebrationBoxesImg,
        link: "/shop?category=celebration"
    }
];

export default function Home() {
    const { addToCart } = useCart();
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const imgBaseUrl = api.defaults.baseURL.replace('/api', '');

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const prodRes = await api.get('/products');
                setBestSellers(prodRes.data.filter(p => p.status === 'Active' && p.best_seller).slice(0, 6));
            } catch (err) {
                console.error("Error fetching home data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <main className="min-h-screen">
            <SEO
                title="Cookie Heaven | Freshly Baked Premium Cookies"
                description="Discover freshly baked cookies made with premium ingredients. Shop chocolate chip, double chocolate, butter cookies, brownies, and more with fast delivery."
                keywords="Cookie Heaven, Fresh Cookies, Premium Cookies, Chocolate Chip Cookies, Buy Cookies Online, Bakery"
                canonical="https://www.cookieheaven.com/"
            />

            <HeroSection />

            {/* SECTION 1 — FIND YOUR PERFECT TREAT */}
            <section className="py-16 px-4 bg-[#FFFDF8] relative h-auto">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#8b4513] mb-4 font-['Poppins']">Find Your Perfect Treat</h2>
                        <p className="text-gray-600 text-lg">Perfect gifts, delicious combos, and sweet treats for every occasion.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-auto relative">
                        {staticCategories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full block"
                            >
                                <Link to={cat.link} className="group block h-full">
                                    <div className="bg-white rounded-[24px] p-5 lg:p-6 text-center h-full flex flex-col items-center border border-[#F2E8DB] shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                                        <div className="w-full aspect-square overflow-hidden rounded-2xl mb-5 shadow-inner">
                                            <img
                                                src={cat.img}
                                                alt={cat.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="font-bold text-[#1E293B] text-xl mb-3">{cat.title}</h3>
                                        <p className="text-sm text-gray-500 mb-6 flex-grow">{cat.desc}</p>
                                        <span className="inline-block mt-auto px-6 py-2 rounded-full text-white bg-[#8B4513] font-semibold text-sm group-hover:bg-[#6e350d] transition-colors shadow-md group-hover:shadow-lg">
                                            {cat.btn}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2 — OUR BEST SELLERS */}
            <section className="py-16 px-4 bg-white h-auto relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#8b4513] mb-4 font-['Poppins']">Our Best Sellers</h2>
                            <p className="text-lg text-gray-600">The treats everyone is talking about.</p>
                        </div>
                        <Link to="/shop" className="text-[#8B4513] font-bold hover:text-[#e07a5f] flex items-center gap-2 transition-colors">
                            View Entire Menu <FiArrowRight />
                        </Link>
                    </div>

                    {!loading && bestSellers.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                            <span className="text-6xl mb-4 block">🧁</span>
                            <p className="text-xl text-gray-500 mb-6 font-medium">No products available in this category yet.</p>
                            <Link to="/shop" className="btn bg-[#8B4513] hover:bg-[#6e350d] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1">
                                View All Products →
                            </Link>
                        </div>
                    ) : (
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 h-auto"
                        >
                            {bestSellers.map(product => (
                                <motion.div key={product.id} variants={fadeIn} className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group relative flex flex-col h-full">
                                    {product.new_arrival && (
                                        <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-full text-white bg-[#e07a5f]">
                                            NEW
                                        </span>
                                    )}

                                    <div className="bg-[#FFFDF8] rounded-2xl aspect-square mb-5 flex items-center justify-center text-7xl overflow-hidden relative shadow-inner">
                                        {product.has_image || product.product_image ? (
                                            <img src={product.has_image ? `${api.defaults.baseURL}/products/${product.id}/image` : `${imgBaseUrl}${product.product_image}`} alt={`${product.product_name} cookie`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <span>🍪</span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-xl text-[#1E293B] mb-2 leading-tight">
                                        {product.product_name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                                        {product.short_description || product.description || "Freshly baked premium treat made with love."}
                                    </p>

                                    <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {product.offer_price && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ₹{product.price}
                                                    </span>
                                                )}
                                                <span className="font-bold text-2xl text-[#8B4513] flex items-baseline gap-1">
                                                    ₹{product.offer_price || product.price}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="flex-1 bg-[#8B4513] text-white py-2.5 rounded-xl font-semibold hover:bg-[#6e350d] transition-colors shadow-md"
                                                aria-label={`Add ${product.product_name} to cart`}
                                            >
                                                Add to Cart
                                            </button>
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="flex-1 bg-gray-100 text-[#8B4513] py-2.5 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 px-4 bg-[#FFFDF8] text-center">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#8b4513] mb-16 font-['Poppins']">Why Cookie Heaven?</h2>

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
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl mb-6 shadow-md border border-[#F2E8DB]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#1E293B] mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed max-w-xs">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
