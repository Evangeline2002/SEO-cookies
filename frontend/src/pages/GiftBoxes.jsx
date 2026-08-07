import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiPackage, FiShoppingBag } from 'react-icons/fi';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import signatureImg from '../assets/signature_gift_box.jpg';
import birthdayImg from '../assets/birthday_giftbox.jpg';
import corporateImg from '../assets/coporate_gift_box.jpg';
import luxuryImg from '../assets/Luxury Gourmet Box.webp';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.12 } }
};

const giftBoxes = [
    {
        id: 'gift-1',
        name: 'Signature Gift Box',
        img: signatureImg,
        price: 799,
        originalPrice: 999,
        badge: 'Popular',
        badgeColor: 'bg-[var(--color-secondary)]',
        description: 'A classic luxury cookie gift box with black and gold premium packaging.',
        includes: ['12 Premium Cookies', 'Chocolate Chip Cookies', 'Double Chocolate Cookies', 'Butter Cookies', 'Satin Ribbon'],
        buttonLabel: 'Place Order',
        buttonVariant: 'outline',
    },
    {
        id: 'gift-2',
        name: 'Birthday Gift Box',
        img: birthdayImg,
        price: 1199,
        originalPrice: 1499,
        badge: 'Bestseller',
        badgeColor: 'bg-red-500',
        description: 'Elegant birthday cookie gift box with a personalised greeting card and luxury packaging.',
        includes: ['18 Assorted Cookies', 'Birthday Greeting Card', 'Luxury Packaging', 'Personalized Name Tag'],
        buttonLabel: 'Place Order',
        buttonVariant: 'primary',
    },
    {
        id: 'gift-3',
        name: 'Corporate Gift Box',
        img: corporateImg,
        price: 1499,
        originalPrice: 1899,
        badge: 'Bulk Deals',
        badgeColor: 'bg-blue-600',
        description: 'Premium corporate cookie gift box with elegant branding and bulk order support.',
        includes: ['24 Handmade Cookies', 'Company Branding', 'Premium Packaging', 'Bulk Order Available'],
        buttonLabel: 'Place Order',
        buttonVariant: 'outline',
    },
    {
        id: 'gift-4',
        name: 'Luxury Gourmet Box',
        img: luxuryImg,
        price: 2499,
        originalPrice: 2999,
        badge: 'Premium',
        badgeColor: 'bg-amber-600',
        description: 'Luxury gourmet cookie collection in a premium wooden gift box with ribbon.',
        includes: ['30 Gourmet Cookies', 'Belgian Chocolate Cookies', 'Brownie Cookies', 'Wooden Gift Box', 'Premium Ribbon'],
        buttonLabel: 'Place Order',
        buttonVariant: 'primary',
    },
];

const features = [
    'Freshly Baked Daily',
    'Premium Ingredients',
    'Beautiful Gift Packaging',
    'Personalized Greeting Card',
    'Eco-Friendly Packaging',
    'Same-Day Delivery',
];

function GiftCard({ box, onOrder }) {
    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(139,69,19,0.13)' }}
            className="relative bg-white rounded-3xl border border-[var(--color-primary)]/10 shadow-sm overflow-hidden flex flex-col group"
        >
            {box.badge && (
                <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-full text-white ${box.badgeColor}`}>
                    {box.badge}
                </span>
            )}

            <div className="h-52 overflow-hidden">
                <img
                    src={box.img}
                    alt={box.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-1">{box.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{box.description}</p>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[var(--color-primary)]">₹{box.price}</span>
                    {box.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{box.originalPrice}</span>
                    )}
                </div>

                <ul className="space-y-1.5">
                    {box.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <FiCheckCircle className="text-[var(--color-secondary)] shrink-0" size={14} />
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-4">
                    <button
                        onClick={() => onOrder(box)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${box.buttonVariant === 'primary'
                                ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                : 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
                            }`}
                    >
                        <FiShoppingBag size={14} /> {box.buttonLabel}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function GiftBoxes() {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleOrder = (box) => {
        addToCart({ id: box.id, name: box.name, price: box.price, img: box.img, emoji: '🎁' });
        navigate('/checkout');
    };

    return (
        <main className="min-h-screen bg-[#FFFDF8]">
            <SEO
                title="Premium Cookie Gift Boxes | Cookie Heaven"
                description="Explore premium cookie gift boxes for birthdays, festivals, weddings, anniversaries, and corporate gifting. Freshly baked handmade cookies with luxury packaging and fast delivery."
                keywords="Cookie Gift Boxes, Premium Gift Boxes, Birthday Cookie Gifts, Corporate Cookie Gifts, Luxury Cookie Box, Handmade Cookie Gifts, Freshly Baked Cookies, Cookie Heaven"
                canonical="https://www.cookieheaven.com/gift-boxes"
            />

            {/* Page Header */}
            <section className="bg-gradient-to-b from-[#FFF8F0] to-white py-20 px-4 text-center border-b border-[var(--color-primary)]/10">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm mb-6 border border-[var(--color-primary)]/20"
                    >
                        <FiPackage size={16} /> Premium Gift Collections
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] text-[var(--color-primary)] mb-6 leading-tight"
                    >
                        Premium Cookie <span className="text-[var(--color-secondary)]">Gift Boxes</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.6 }}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
                    >
                        Celebrate every special moment with our handcrafted premium cookie gift boxes. Beautifully packed with freshly baked cookies — perfect for birthdays, festivals, anniversaries, weddings, and corporate gifting.
                    </motion.p>
                </div>
            </section>

            {/* Gift Box Cards */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {giftBoxes.map((box) => (
                            <GiftCard key={box.id} box={box} onOrder={handleOrder} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-16 px-4 bg-white border-y border-[var(--color-primary)]/10">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center"
                    >
                        {features.map((f, i) => (
                            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                    <FiCheckCircle className="text-[var(--color-primary)]" size={18} />
                                </div>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">{f}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-gradient-to-br from-[var(--color-primary)] to-[#6B2F0A] text-white text-center">
                <div className="container mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-5xl mb-6 block">🎁</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">
                            Looking for the Perfect Gift?
                        </h2>
                        <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
                            Choose from our premium cookie gift boxes and surprise your family, friends, or colleagues with freshly baked handmade cookies.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/shop"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[var(--color-secondary)] text-white font-bold text-lg hover:bg-amber-600 transition-colors shadow-xl hover:-translate-y-1 hover:shadow-2xl duration-300 flex items-center justify-center gap-2"
                            >
                                Shop Gift Boxes <FiArrowRight />
                            </Link>
                            <Link
                                to="/contact"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Customize Gift Box
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
