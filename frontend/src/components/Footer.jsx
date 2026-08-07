import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import logoImg from '../assets/logo.webp';

const footerLinks = [
    {
        title: 'Shop',
        links: [
            { label: 'All Cookies', path: '/shop' },
            { label: 'Best Sellers', path: '/shop?type=bestsellers' },
            { label: 'Gift Boxes', path: '/shop?gift=all' },
            { label: 'Corporate Orders', path: '/contact' }
        ]
    },
    {
        title: 'Explore',
        links: [
            { label: 'About Us', path: '/about' },
            { label: 'Our Recipes', path: '/recipes' },
            { label: 'Blog', path: '/blog' },
            { label: 'Customer Reviews', path: '/#reviews' }
        ]
    },
    {
        title: 'Help',
        links: [
            { label: 'FAQ', path: '/faq' },
            { label: 'Contact Support', path: '/contact' }
        ]
    }
];

export default function Footer() {
    return (
        <footer className="bg-[var(--color-primary)] text-white pt-16 pb-8 border-t-4 border-[var(--color-accent)] mt-auto font-sans" role="contentinfo">
            <div className="container mx-auto px-4 md:px-6">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-12 mb-16">

                    {/* Brand Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <img src={logoImg} alt="Cookie Heaven Logo" className="h-14 w-14 rounded-full object-cover border-2 border-white/20 shadow-sm group-hover:scale-110 transition-transform" />
                            <span className="font-['Poppins'] font-bold text-3xl tracking-tight text-white">
                                Cookie Heaven
                            </span>
                        </Link>
                        <p className="text-white/80 leading-relaxed font-medium">
                            Premium handmade cookies baked fresh daily with love and the finest ingredients. Delivered straight from our ovens to your door.
                        </p>
                        <div className="space-y-3 pt-2 text-white/90">
                            <p className="flex items-start gap-3">
                                <FiMapPin className="shrink-0 mt-1 text-[var(--color-accent)]" />
                                <span>123 Bakery Lane, Dessert District<br />New Delhi, 110001</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <FiPhone className="shrink-0 text-[var(--color-accent)]" />
                                <a href="tel:+919876543210" className="hover:text-[var(--color-accent)] transition-colors">+91 98765 43210</a>
                            </p>
                            <p className="flex items-center gap-3">
                                <FiMail className="shrink-0 text-[var(--color-accent)]" />
                                <a href="mailto:hello@cookieheaven.com" className="hover:text-[var(--color-accent)] transition-colors">hello@cookieheaven.com</a>
                            </p>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {footerLinks.map((column) => (
                            <div key={column.title}>
                                <h3 className="font-bold text-lg mb-6 text-[var(--color-accent)]">{column.title}</h3>
                                <ul className="space-y-4">
                                    {column.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                to={link.path}
                                                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block pb-1 border-b border-transparent hover:border-[var(--color-accent)]"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-3 space-y-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm self-start">
                        <h3 className="font-bold text-lg text-[var(--color-accent)]">Join the Cookie Club</h3>
                        <p className="text-white/80 text-sm">
                            Subscribe to get 10% off your first order and exclusive secret recipes!
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-accent)] focus:bg-white/15 transition-all text-sm"
                            />
                            <button
                                type="submit"
                                className="w-full font-semibold py-3 px-6 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/70 text-sm font-medium">
                        © {new Date().getFullYear()} Cookie Heaven. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-accent)] hover:text-white text-white/90 transition-all duration-300 hover:scale-110"
                                aria-label="Social Media Link"
                            >
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}
