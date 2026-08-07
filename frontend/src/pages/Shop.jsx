import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiStar, FiShoppingCart, FiPlus } from 'react-icons/fi';
import { products, CATEGORIES, SHOP_CATEGORIES } from '../utils/productData';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const fadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const catParam = searchParams.get('cat');
    const typeParam = searchParams.get('type');

    const [activeCategory, setActiveCategory] = useState(catParam || 'All');
    const [sortBy, setSortBy] = useState('featured');
    const { addToCart } = useCart();

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category filter
        if (activeCategory !== 'All') {
            result = result.filter(p => p.category === activeCategory);
        }

        // Type queries
        if (typeParam === 'bestsellers') {
            result = result.filter(p => p.bestseller);
        } else if (typeParam === 'new') {
            result = result.filter(p => p.badge === 'new');
        } else if (typeParam === 'offers' || typeParam === 'sale') {
            result = result.filter(p => p.originalPrice);
        }

        // Sort
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

        return result;
    }, [activeCategory, typeParam, sortBy]);

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        if (typeParam) {
            searchParams.delete('type');
            setSearchParams(searchParams);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)] pb-24">
            <SEO
                title="Shop Premium Cookies | Cookie Heaven"
                description="Browse our complete collection of handmade premium cookies, gift boxes, and bakery specials."
            />

            {/* Page Header */}
            <div className="bg-[var(--color-primary)] text-white pt-16 pb-12 px-4 shadow-inner">
                <div className="container mx-auto text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4 block">
                        The Cookie Shop
                    </h1>
                    <p className="text-white/80 text-lg">
                        Freshly baked happiness, ready to be delivered to your door.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar / Filters */}
                    <aside className="w-full lg:w-64 shrink-0 p-6 bg-white rounded-3xl shadow-sm border border-[var(--color-primary)]/10">
                        <h2 className="font-bold text-xl text-[var(--color-primary-dark)] mb-6 flex items-center gap-2">
                            <FiFilter /> Filter By
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 uppercase tracking-wider text-xs">Cookie Types</h3>
                                <ul className="space-y-2">
                                    {CATEGORIES.map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => handleCategoryClick(cat)}
                                                className={`text-left w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeCategory === cat ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'}`}
                                            >
                                                {cat} {cat === activeCategory && '✓'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1 w-full">

                        {/* Top Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-primary)]/10 mb-8 gap-4">
                            <p className="text-gray-600 font-medium">
                                Showing <strong className="text-[var(--color-primary)]">{filteredProducts.length}</strong> delicious cookies
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block p-2 outline-none font-medium"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.length > 0 ? (
                                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            layout
                                            key={product.id}
                                            variants={fadeIn}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative"
                                        >
                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                {product.badge && (
                                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full text-white shadow-sm ${product.badge === 'hot' ? 'bg-red-500' : 'bg-[var(--color-secondary)]'}`}>
                                                        {product.badge}
                                                    </span>
                                                )}
                                                {product.originalPrice && (
                                                    <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-full shadow-sm">
                                                        Sale
                                                    </span>
                                                )}
                                            </div>

                                            {/* Fake Image Container */}
                                            <Link to={`/product/${product.id}`} className="block">
                                                <div className="bg-[#FFFDF8] rounded-2xl h-56 mb-5 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500 border border-[var(--color-primary)]/5 overflow-hidden relative">
                                                    {product.img ? (
                                                        <img src={product.img} alt={product.name} className="w-full h-full object-cover !scale-100" />
                                                    ) : (
                                                        product.emoji
                                                    )}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                </div>
                                            </Link>

                                            {/* Content */}
                                            <div className="flex flex-col flex-1">
                                                <Link to={`/product/${product.id}`}>
                                                    <h3 className="font-bold text-lg text-[var(--color-text)] mb-1 leading-snug hover:text-[var(--color-primary)] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center gap-1 mb-3 text-yellow-400 text-sm">
                                                    <FiStar className="fill-current" />
                                                    <span className="text-gray-500 font-medium ml-1">{product.rating} ({product.reviews})</span>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between pt-4">
                                                    <div className="flex flex-col">
                                                        {product.originalPrice && (
                                                            <span className="text-xs text-gray-400 line-through -mb-1">
                                                                ₹{product.originalPrice}
                                                            </span>
                                                        )}
                                                        <span className="font-bold text-xl text-[var(--color-primary)] flex items-baseline gap-1">
                                                            ₹{product.price}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="bg-[var(--color-background)] border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                                                        aria-label={`Add ${product.name} to cart`}
                                                    >
                                                        <FiPlus size={20} className="stroke-[3]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm"
                                >
                                    <div className="text-6xl mb-4 opacity-50">😢</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No cookies found!</h3>
                                    <p className="text-gray-500 mb-6">We couldn't find any cookies matching your current filters.</p>
                                    <button
                                        onClick={() => { setActiveCategory('All'); setSearchParams({}); }}
                                        className="btn btn-primary"
                                    >
                                        Clear Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </main>
    );
}
