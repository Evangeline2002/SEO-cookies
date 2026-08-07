import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi';
import SEO from '../components/SEO';

import heroBg from '../assets/hero3.webp';
import chocoChipImg from '../assets/Chocolate_Chip_Classic_Cookie.jpg';
import doubleChocoImg from '../assets/double_chocolate_chip_cookies-3-1.jpg';
import butterImg from '../assets/butter cookies.jpg';
import brownieImg from '../assets/fudy_browine_cookies.jpg';
import redVelvetImg from '../assets/red velvet cookies.jpg';
import oatmealImg from '../assets/oatmeal raisin cookies.jpg';

const recipes = [
    {
        id: 1,
        title: "Chocolate Chip Cookies",
        image: chocoChipImg,
        prepTime: "25 Minutes",
        difficulty: "Easy",
        description: "The classic, gooey, and irresistibly sweet chocolate chip cookie everyone loves."
    },
    {
        id: 2,
        title: "Double Chocolate Cookies",
        image: doubleChocoImg,
        prepTime: "30 Minutes",
        difficulty: "Medium",
        description: "A rich, decadent chocolate cookie stuffed with extra chocolate chunks."
    },
    {
        id: 3,
        title: "Butter Cookies",
        image: butterImg,
        prepTime: "20 Minutes",
        difficulty: "Easy",
        description: "Melt-in-your-mouth, simple, yet elegant buttery rings."
    },
    {
        id: 4,
        title: "Brownie Cookies",
        image: brownieImg,
        prepTime: "35 Minutes",
        difficulty: "Medium",
        description: "Fudgy brownie centers with extremely satisfying crispy cookie edges."
    },
    {
        id: 5,
        title: "Red Velvet Cookies",
        image: redVelvetImg,
        prepTime: "30 Minutes",
        difficulty: "Easy",
        description: "Beautiful crimson cookies paired with exquisite white chocolate chips."
    },
    {
        id: 6,
        title: "Oatmeal Cookies",
        image: oatmealImg,
        prepTime: "25 Minutes",
        difficulty: "Easy",
        description: "A hearty, wholesome cookie with chewy oats."
    }
];

const features = [
    {
        title: "Premium Ingredients",
        desc: "We use only high-quality butter, chocolate, and natural ingredients."
    },
    {
        title: "Easy to Follow",
        desc: "Simple recipes suitable for beginners and experienced bakers."
    },
    {
        title: "Fresh Every Time",
        desc: "Bake delicious cookies with perfect texture and flavor."
    },
    {
        title: "Family Favorites",
        desc: "Recipes loved by kids and adults alike."
    }
];

const tips = [
    "Use room-temperature butter.",
    "Measure ingredients accurately.",
    "Do not overmix the dough.",
    "Chill the dough before baking.",
    "Bake until the edges are golden.",
    "Allow cookies to cool before serving."
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 15 } }
};

export default function Recipes() {
    return (
        <main className="bg-[#FFFDF9] min-h-screen font-['Poppins']">
            <SEO
                title="Our Recipes | Cookie Heaven"
                description="Discover Cookie Heaven's delicious cookie recipes made with premium ingredients. Explore chocolate chip, double chocolate, butter cookies, brownies, and other homemade cookie recipes."
                keywords="Cookie Recipes, Chocolate Chip Cookie Recipe, Double Chocolate Cookie Recipe, Butter Cookie Recipe, Homemade Cookies, Freshly Baked Cookies, Premium Cookie Recipes, Cookie Heaven Recipes, Easy Cookie Recipes, Bakery Recipes"
                canonical="/recipes"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0 bg-[#8B4513]">
                    <img
                        src={heroBg}
                        alt="Premium bakery kitchen with freshly baked cookies."
                        className="w-full h-full object-cover mix-blend-overlay opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFDF9]/80 to-[#FFFDF9]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#5C2D0A] mb-6 tracking-tight drop-shadow-sm">
                            Our Delicious Cookie Recipes
                        </h1>
                        <p className="text-[#8B4513] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                            Discover the secret behind our freshly baked premium cookies. Every recipe is made with carefully selected ingredients to create the perfect taste and texture.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                href="#recipes"
                                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white font-semibold rounded-full shadow-lg shadow-[#8B4513]/30 transition-shadow hover:shadow-xl"
                            >
                                Explore Recipes
                            </motion.a>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/shop"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#8B4513] border-2 border-[#8B4513] font-semibold rounded-full shadow-md transition-all hover:bg-[#8B4513]/5 block text-center"
                                >
                                    Shop Cookies
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Recipes Grid */}
            <section id="recipes" className="py-20 bg-[#FFFDF9]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
                    >
                        {recipes.map(recipe => (
                            <motion.article
                                key={recipe.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-[var(--color-primary)]/5 border border-amber-50 group transition-all duration-300 flex flex-col"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 w-full h-full" />
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-[#5C2D0A] mb-3">{recipe.title}</h3>
                                    <p className="text-gray-500 mb-6 flex-1 text-sm leading-relaxed">{recipe.description}</p>

                                    <div className="flex items-center gap-4 text-sm font-semibold text-[#8B4513] mb-8 bg-[#FFF8F2] p-4 rounded-2xl">
                                        <div className="flex items-center gap-2">
                                            <FiClock size={16} aria-label="Preparation Time" /> {recipe.prepTime}
                                        </div>
                                        <div className="w-px h-4 bg-[#8B4513]/20"></div>
                                        <div className="flex items-center gap-2">
                                            <FiActivity size={16} aria-label="Difficulty" /> {recipe.difficulty}
                                        </div>
                                    </div>

                                    <button className="w-full py-3.5 rounded-xl border-2 border-[#8B4513] text-[#8B4513] font-bold text-sm tracking-wide uppercase transition-colors hover:bg-[#8B4513] hover:text-white" aria-label={`View recipe for ${recipe.title}`}>
                                        View Recipe
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Why Our Recipes */}
            <section className="py-24 bg-[#FEF0E0]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#5C2D0A]">Why You'll Love Our Recipes</h2>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white p-6 rounded-3xl shadow-lg border border-white/60 text-center transition-all bg-gradient-to-br hover:from-white hover:to-[#FFF8F2]"
                            >
                                <div className="w-14 h-14 rounded-full bg-[#8B4513]/10 flex items-center justify-center mx-auto mb-4 text-[#8B4513]">
                                    <FiCheckCircle size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-[#5C2D0A] mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Baking Tips */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#5C2D0A] mb-10">Cookie Baking Tips</h2>
                        <ul className="text-left bg-[#FFF8F2] p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[var(--color-primary)]/5 border border-amber-50 space-y-4 grid md:grid-cols-2 gap-x-8">
                            {tips.map((tip, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-[#8B4513] font-medium p-2 rounded-lg hover:bg-white transition-colors">
                                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-sm shrink-0 font-bold border border-amber-100">
                                        {idx + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-24 relative overflow-hidden bg-[#8B4513]">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src={chocoChipImg}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover mix-blend-overlay"
                    />
                </div>
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Taste Freshly Baked Cookies?</h2>
                        <p className="text-[#FEF0E0] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Don't have time to bake? Order our freshly baked premium cookies and enjoy bakery-quality treats delivered to your door.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-white text-[#8B4513] font-bold rounded-full shadow-xl block text-center uppercase tracking-wide text-sm">
                                    Order Now
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/gift-boxes" className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-bold rounded-full transition-colors block text-center uppercase tracking-wide text-sm">
                                    View Gift Boxes
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Hidden SEO Content */}
            <section className="sr-only">
                <h2>Freshly Baked Cookie Recipes</h2>
                <p>
                    Cookie Heaven shares easy and delicious cookie recipes made with premium ingredients.
                    Learn how to bake chocolate chip cookies, double chocolate cookies, butter cookies,
                    brownies, and more with simple step-by-step guidance.
                </p>
            </section>
        </main>
    );
}
