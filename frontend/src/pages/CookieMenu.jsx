import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import SEO from '../components/SEO';
import { products } from '../utils/productData';

export default function CookieMenu() {
    const categories = [...new Set(products.map(p => p.category))];

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-b from-[#FFFDF8] to-white">
            <SEO
                title="Our Cookie Menu | Cookie Heaven"
                description="Browse our full menu of premium handmade cookies. From chocolate chip to vegan options, find your perfect cookie."
            />

            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm mb-4 border border-[var(--color-primary)]/20">
                        🍪 Our Full Menu
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold font-['Poppins'] text-[var(--color-primary)] mb-4">
                        Choose Your Cookie
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Every cookie is handcrafted with premium ingredients and baked fresh daily.
                        Pick your favorites or try them all!
                    </p>
                </motion.div>

                {/* Categories */}
                {categories.map((cat, ci) => (
                    <section key={cat} className="mb-16">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl font-bold font-['Poppins'] text-[var(--color-primary-dark)] mb-6 flex items-center gap-3"
                        >
                            <span className="w-8 h-1 bg-[var(--color-secondary)] rounded-full"></span>
                            {cat} Cookies
                        </motion.h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products
                                .filter(p => p.category === cat)
                                .map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group bg-white rounded-3xl shadow-sm border border-[var(--color-primary)]/10 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative h-52 overflow-hidden bg-[#FFFDF8]">
                                            {product.img ? (
                                                <img
                                                    src={product.img}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                                                    {product.emoji}
                                                </div>
                                            )}
                                            {product.badge && (
                                                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${product.badge === 'hot' ? 'bg-red-500 text-white' :
                                                        product.badge === 'new' ? 'bg-green-500 text-white' :
                                                            product.badge === 'sale' ? 'bg-orange-500 text-white' :
                                                                'bg-[var(--color-secondary)] text-white'
                                                    }`}>
                                                    {product.badge === 'hot' ? '🔥 Hot' :
                                                        product.badge === 'new' ? '✨ New' :
                                                            product.badge === 'sale' ? '🏷️ Sale' :
                                                                product.badge}
                                                </span>
                                            )}
                                            {product.rating && (
                                                <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                                                    <FiStar className="text-yellow-500" size={12} />
                                                    {product.rating}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl">{product.emoji}</span>
                                                <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-2 py-0.5 rounded-full">
                                                    {product.weight}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg text-[var(--color-primary-dark)] mb-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-xl font-bold text-[var(--color-secondary)]">
                                                    ₹{product.price}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{product.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
                                            >
                                                View Details <FiArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </section>
                ))}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 p-12 rounded-[3rem] bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/10"
                >
                    <h2 className="text-3xl font-bold font-['Poppins'] text-[var(--color-primary)] mb-4">
                        Can't Decide?
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try our best-selling Gift Boxes — a curated selection of our most popular cookies!
                    </p>
                    <Link to="/shop?gift=all" className="btn btn-primary px-8 py-3">
                        Explore Gift Boxes
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
