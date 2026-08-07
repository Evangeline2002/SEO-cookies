import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiChevronDown, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.webp';

const mainLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

export default function Navbar({ onCartClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    return (
        <>
            {/* Top Banner */}
            <div className="bg-[var(--color-primary)] text-white text-xs font-semibold py-2 px-4 text-center tracking-wide">
                🍪 FREE SHIPPING ON ALL BOXES OVER ₹499! ORDER NOW FOR NEXT DAY DELIVERY 🚚
            </div>

            <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-[var(--color-background)] py-5'}`}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-[var(--color-primary)] p-2 hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <FiMenu size={24} />
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src={logoImg} alt="Cookie Heaven Logo" className="h-12 md:h-14 w-12 md:w-14 rounded-full object-cover border-2 border-[var(--color-primary)]/10 shadow-sm transform group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-['Poppins'] font-bold text-2xl md:text-3xl text-[var(--color-primary)] tracking-tight">
                                Cookie Heaven
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                            {mainLinks.map((link) => (
                                <div
                                    key={link.label}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(link.label)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) => `
                      flex items-center gap-1 px-4 py-2 font-semibold rounded-full transition-colors duration-300
                      ${isActive ? 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/10' : 'text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'}
                    `}
                                    >
                                        {link.label}
                                        {link.dropdown && <FiChevronDown className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                                    </NavLink>

                                    {/* Dropdown Menu */}
                                    {link.dropdown && (
                                        <AnimatePresence>
                                            {activeDropdown === link.label && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute left-0 top-full pt-2 min-w-[220px]"
                                                >
                                                    <div className="bg-white rounded-2xl shadow-xl p-2 border border-[var(--color-primary)]/10 flex flex-col gap-1 relative overflow-hidden">
                                                        {/* Decorative top bar */}
                                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

                                                        {link.dropdown.map(subItem => (
                                                            <Link
                                                                key={subItem.label}
                                                                to={subItem.path}
                                                                className="px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)] hover:pl-6 transition-all duration-300 rounded-xl"
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {isLoggedIn && user ? (
                                <div className="hidden md:flex items-center gap-3 mr-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                                    {user.picture ? (
                                        <img src={user.picture} alt={user.name || user.email} className="w-7 h-7 rounded-full object-cover border border-white shadow-sm" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold font-['Poppins'] shadow-sm">
                                            {(user.name || user.email)?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                                        {user.loginMethod === 'email' ? user.email : `Welcome, ${user.name}`}
                                    </span>
                                    <button
                                        onClick={() => {
                                            logout();
                                        }}
                                        className="text-xs font-medium text-red-500 hover:text-red-700 ml-1 transition-colors hover:underline"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="hidden md:flex items-center gap-2 font-semibold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors p-2">
                                    <FiUser size={20} /> <span className="hidden xl:inline">Login</span>
                                </Link>
                            )}

                            <button
                                onClick={onCartClick}
                                className="relative p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors group"
                                aria-label="View shopping cart"
                            >
                                <FiShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[var(--color-secondary)] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <Link to="/shop" className="hidden lg:inline-flex btn btn-primary py-2.5 px-6 ml-2 text-sm">
                                Order Now
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col lg:hidden"
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <Link to="/" className="flex items-center gap-2">
                                    <img src={logoImg} alt="Cookie Heaven Logo" className="h-10 w-10 rounded-full object-cover border-2 border-[var(--color-primary)]/10 shadow-sm" />
                                    <span className="font-bold text-xl text-[var(--color-primary)]">Cookie Heaven</span>
                                </Link>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                                {mainLinks.map((link) => (
                                    <div key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="block px-4 py-3 font-semibold text-lg text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-xl"
                                        >
                                            {link.label}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="pl-6 mt-1 space-y-1 border-l-2 border-[var(--color-primary)]/20 ml-6 pb-2">
                                                {link.dropdown.map(subItem => (
                                                    <Link
                                                        key={subItem.label}
                                                        to={subItem.path}
                                                        className="block px-4 py-2 font-medium text-sm text-gray-600 hover:text-[var(--color-primary)] rounded-lg"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-[var(--color-background)] border-t border-[var(--color-primary)]/10 space-y-4">
                                {isLoggedIn && user ? (
                                    <div className="flex flex-col gap-3 mb-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            {user.picture ? (
                                                <img src={user.picture} alt={user.name || user.email} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                    {(user.name || user.email)?.charAt(0)?.toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Welcome back</p>
                                                <p className="font-semibold text-gray-800 line-clamp-1">{user.loginMethod === 'email' ? user.email : user.name}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full py-2.5 text-sm font-semibold text-red-50 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-xl transition-colors mt-1"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="flex items-center justify-center gap-2 w-full px-6 py-3 font-bold text-[var(--color-primary)] bg-white border border-[var(--color-primary)] rounded-full text-center hover:bg-gray-50 active:scale-[0.98] transition-all">
                                        <FiUser /> Login / Register
                                    </Link>
                                )}
                                <Link to="/shop" className="btn btn-primary w-full flex justify-center shadow-none">
                                    Order Now
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
