import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroVideo from '../assets/Herosection_mp4.mp4';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HeroSection() {
    return (
        <section className="relative min-h-[85vh] flex items-center py-16 px-4 overflow-hidden">
            {/* Full Background Video */}
            <div className="absolute inset-0 z-0 bg-black">
                <video
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-[75%_35%] opacity-70"
                />
                {/* Subtle dark gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Decorative Emojis (Optional, maybe keep them subtle) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-32 left-[10%] text-7xl opacity-20 filter blur-[1px]"
                >🍪</motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-32 right-[15%] text-8xl opacity-10 filter blur-[2px]"
                >🍫</motion.div>
            </div>

            <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-start gap-12 max-w-7xl h-full">
                {/* Clean Content aligned to left */}
                <div className="flex-1 text-left max-w-2xl px-4 md:px-0">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        className="inline-block py-2 px-5 rounded-full bg-black/40 text-white font-semibold text-sm mb-6 border border-white/20 backdrop-blur-sm"
                    >
                        ✨ Voted Best Bakery 2026
                    </motion.span>

                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeIn}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] text-white leading-tight mb-6 drop-shadow-2xl"
                    >
                        A Taste of <br />
                        Heaven in <br />
                        Every Single <br />
                        <span className="text-[#FFD166]">Bite.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-100 mb-10 max-w-lg leading-relaxed drop-shadow-xl font-medium"
                    >
                        Handcrafted with love, premium ingredients, and baked fresh daily. Experience the joy of our gourmet cookies delivered straight to your door.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-start gap-4"
                    >
                        <Link to="/shop" className="btn bg-[#8B4513] hover:bg-[#6e350d] text-white border-none shadow-lg text-lg w-full sm:w-auto px-8 py-4 transition-transform hover:-translate-y-1">
                            Explore Our Cookies
                        </Link>
                        <Link to="/shop?type=bestsellers" className="btn bg-black/30 backdrop-blur-sm text-white border border-white/40 hover:bg-black/50 hover:border-white text-lg w-full sm:w-auto px-8 py-4 transition-transform hover:-translate-y-1">
                            Shop Best Sellers
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
