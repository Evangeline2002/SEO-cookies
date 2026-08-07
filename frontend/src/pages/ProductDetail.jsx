import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const imgBaseUrl = api.defaults.baseURL.replace('/api', '');

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div></div>;

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4">Cookie Not Found</h1>
                    <p className="mb-6 text-gray-600">The product you are looking for does not exist.</p>
                    <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
                </div>
            </main>
        );
    }

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.product_name,
        "image": "https://www.cookiesnack.com/favicon.svg",
        "description": `Buy our premium handmade ${product.product_name}. Freshly baked and delivered.`,
        "sku": product.sku || `CH-${product.id}`,
        "offers": {
            "@type": "Offer",
            "url": `https://www.cookiesnack.com/product/${product.id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviews
        }
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)] py-12 px-4">
            <SEO
                title={`${product.product_name} | Cookie Heaven`}
                description={product.short_description || `Order delicious ${product.product_name} online. Baked fresh every day with premium ingredients. Fast cookie delivery.`}
                schema={schema}
            />

            <div className="container mx-auto max-w-6xl">
                {/* Breadcrumb */}
                <nav className="text-sm font-medium text-gray-500 mb-8" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex">
                        <li className="flex items-center">
                            <Link to="/" className="hover:text-[var(--color-primary)]">Home</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="flex items-center">
                            <Link to="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="flex items-center">
                            <Link to={`/shop?cat=${encodeURIComponent(product.category_name || '')}`} className="hover:text-[var(--color-primary)]">{product.category_name || 'Uncategorized'}</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-[var(--color-primary)]" aria-current="page">{product.product_name}</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-primary)]/10 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Galery */}
                        <div className="bg-[#FFFDF8] p-12 md:p-20 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--color-primary)]/10 relative">
                            {product.new_arrival && (
                                <span className="absolute top-6 left-6 z-10 px-4 py-1.5 text-sm font-bold uppercase rounded-full text-white shadow-sm bg-[var(--color-secondary)]">
                                    NEW
                                </span>
                            )}

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className={`drop-shadow-2xl filter ${product.product_image ? 'w-full h-80 flex items-center justify-center' : 'text-9xl md:text-[12rem]'}`}
                            >
                                {product.product_image ? (
                                    <img src={`${imgBaseUrl}${product.product_image}`} alt={product.product_name} className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white/50" />
                                ) : (
                                    <span>🍪</span>
                                )}
                            </motion.div>
                        </div>

                        {/* Details */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                            <h1 className="text-3xl md:text-5xl font-bold font-['Poppins'] text-[var(--color-primary)] leading-tight mb-4">
                                {product.product_name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={i < Math.floor(product.rating || 5) ? "fill-current" : ""} />
                                    ))}
                                    <span className="text-gray-600 font-medium ml-1 text-sm">{product.rating || 5} ({product.reviews || 0} reviews)</span>
                                </div>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                <span className={`text-lg font-medium flex items-center gap-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    <FiCheck /> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-600 font-medium">{product.weight || 'Standard Box'}</span>
                            </div>

                            <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
                                {product.offer_price && (
                                    <span className="text-xl text-gray-400 line-through mb-1">
                                        ₹{product.price}
                                    </span>
                                )}
                                <span className="text-4xl font-bold text-[var(--color-primary)]">
                                    ₹{product.offer_price || product.price}
                                </span>
                                <span className="text-gray-500 mb-1 ml-1 text-lg">/ box</span>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-10 text-lg">
                                {product.short_description || `Experience the perfect balance of flavors in our signature ${product.product_name.toLowerCase()}. Baked fresh every morning with premium ingredients, these cookies deliver a heavenly melt-in-your-mouth experience that you won't forget.`}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                {/* Quantity */}
                                <div className="flex border-2 border-gray-200 rounded-full h-14 bg-white shrink-0 items-center overflow-hidden">
                                    <button
                                        className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <FiMinus />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-12 h-full text-center font-bold text-lg border-none focus:ring-0 p-0 text-[var(--color-text)]"
                                    />
                                    <button
                                        className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={() => addToCart(product, quantity)}
                                    className="btn btn-primary flex-1 h-14 text-lg w-full flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                >
                                    <FiShoppingCart className="mr-1" /> Add to Cart
                                </button>
                            </div>

                            {/* USP List */}
                            <ul className="mt-8 space-y-2">
                                {['100% Eggless Options Available', 'Free Shipping over ₹499', 'Baked fresh on order day'].map((usp, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <FiCheck className="text-green-500" /> {usp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Product Information Tabs */}
                <div className="mt-16 bg-white rounded-3xl shadow-sm border border-[var(--color-primary)]/10 p-8 md:p-12">
                    <div className="flex flex-wrap gap-8 border-b border-gray-200 mb-8">
                        {['description', 'ingredients', 'nutrition'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 font-bold text-lg transition-colors relative uppercase tracking-wider uppercase text-sm ${activeTab === tab ? 'text-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div
                                    key="desc"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="prose max-w-none text-gray-700 leading-relaxed text-lg"
                                >
                                    <p>{product.description || "Indulge in the luxurious taste of our premium handmade cookies. Our bakers start before dawn to ensure every batch is fresh, chewy, and perfectly golden."}</p>
                                    <p className="mt-4">Each box is carefully packed to preserve freshness and ensure your cookies arrive in pristine condition.</p>
                                </motion.div>
                            )}
                            {activeTab === 'ingredients' && (
                                <motion.div
                                    key="ingg"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="prose max-w-none text-gray-700 leading-relaxed text-lg"
                                >
                                    {product.ingredients ? (
                                        <p>{product.ingredients}</p>
                                    ) : (
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Premium Organic All-Purpose Flour</li>
                                            <li>European-style Cultured Butter</li>
                                            <li>Pure Cane Sugar & Brown Sugar</li>
                                            <li>Free-range Eggs</li>
                                            <li>Pure Madagascar Bourbon Vanilla Extract</li>
                                            <li>Sea Salt</li>
                                        </ul>
                                    )}
                                    <p className="mt-6 text-sm text-red-500 font-medium">Allergy Advice: Contains gluten and dairy. May contain traces of nuts.</p>
                                </motion.div>
                            )}
                            {activeTab === 'nutrition' && (
                                <motion.div
                                    key="nutr"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-gray-700 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                            <thead className="bg-[#FFFDF8] text-[var(--color-primary-dark)] text-sm uppercase">
                                                <tr>
                                                    <th className="px-6 py-4 border-b border-[var(--color-primary)]/10 text-lg font-bold">Nutrient</th>
                                                    <th className="px-6 py-4 border-b border-[var(--color-primary)]/10 text-lg font-bold">Per 100g</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-100 bg-white"><td className="px-6 py-4 font-medium">Energy</td><td className="px-6 py-4">450 kcal</td></tr>
                                                <tr className="border-b border-gray-100 bg-gray-50"><td className="px-6 py-4 font-medium">Total Fat</td><td className="px-6 py-4">22g</td></tr>
                                                <tr className="border-b border-gray-100 bg-white"><td className="px-6 py-4 font-medium">Carbohydrates</td><td className="px-6 py-4">58g</td></tr>
                                                <tr className="border-b border-gray-100 bg-gray-50"><td className="px-6 py-4 font-medium">Protein</td><td className="px-6 py-4">5g</td></tr>
                                                <tr className="bg-white"><td className="px-6 py-4 font-medium">Sugar</td><td className="px-6 py-4">32g</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
