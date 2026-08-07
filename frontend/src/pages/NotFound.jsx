import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';
import SEO from '../components/SEO';
import notFoundImg from '../assets/butter cookies.jpg';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-[#FFFDF8] to-white">
            <SEO title="404 - Page Not Found | Cookie Heaven" description="Oops! The page you're looking for doesn't exist." />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
            >
                <div className="relative inline-block mb-8">
                    <motion.div
                        animate={{ rotate: [0, -8, 8, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-8xl md:text-9xl font-['Poppins'] font-bold text-[var(--color-primary)] opacity-20 select-none"
                    >
                        404
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <span className="text-7xl">🍪</span>
                    </motion.div>
                </div>

                <div className="mb-8 rounded-3xl overflow-hidden shadow-lg border border-[var(--color-primary)]/10">
                    <img
                        src={notFoundImg}
                        alt="Delicious cookie"
                        className="w-full h-56 object-cover"
                    />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[var(--color-primary)] mb-4">
                    Oops! Page Not Found
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Looks like this cookie crumbled away! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="btn btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
                >
                    <FiHome size={18} />
                    Back to Home
                </Link>
            </motion.div>
        </main>
    );
}
