import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImg from '../assets/hero.png';
import hero2Img from '../assets/hero2.jpg';
import hero3Img from '../assets/hero3.webp';
import hero4Img from '../assets/hero4.jpg';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroImages = [heroImg, hero2Img, hero3Img, hero4Img];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 lg:pt-14 lg:pb-20 px-4 bg-gradient-to-br from-[#FFFDF8] to-[#FFF0E0]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-[10%] text-7xl opacity-20 filter blur-[2px]"
                >🍪</motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 right-[15%] text-8xl opacity-10 filter blur-[3px]"
                >🍫</motion.div>
            </div>

            <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl">
                <div className="flex-1 text-center md:text-left">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        className="inline-block py-1.5 px-4 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm mb-6 border border-[var(--color-primary)]/20 shadow-sm"
                    >
                        ✨ Voted Best Bakery 2026
                    </motion.span>
                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeIn}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] text-[var(--color-primary)] leading-tight mb-8"
                    >
                        A Taste of Heaven in <br /><span className="text-[var(--color-secondary)]">Every Single Bite.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed"
                    >
                        Handcrafted with love, premium ingredients, and baked fresh daily.
                        Experience the joy of our gourmet cookies delivered straight to your door.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                    >
                        <Link to="/shop" className="btn btn-primary text-lg w-full sm:w-auto px-8 py-4">
                            Explore Our Cookies
                        </Link>
                        <Link to="/shop?type=bestsellers" className="btn bg-white text-[var(--color-primary)] border border-gray-200 hover:border-[var(--color-primary)] hover:bg-gray-50 text-lg w-full sm:w-auto px-8 py-4">
                            Shop Best Sellers
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Image Slideshow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex-1 w-full max-w-2xl"
                >
                    <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                        {heroImages.map((src, i) => (
                            <motion.img
                                key={i}
                                src={src}
                                initial={false}
                                animate={{ opacity: i === currentSlide ? 1 : 0 }}
                                transition={{ duration: 0.7, ease: 'easeInOut' }}
                                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] drop-shadow-2xl"
                                alt={`Freshly baked cookies ${i + 1}`}
                                loading="eager"
                            />
                        ))}
                    </div>
                    <div className="flex justify-center gap-3 mt-6">
                        {heroImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide
                                    ? 'bg-[var(--color-primary)] w-8'
                                    : 'bg-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/50'
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
