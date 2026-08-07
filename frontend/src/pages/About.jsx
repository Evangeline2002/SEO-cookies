import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import SEO from '../components/SEO';
import sweetImg from '../assets/sweet.png';

export default function About() {
    return (
        <main className="min-h-screen">
            <SEO
                title="About Cookie Heaven | Freshly Baked Premium Cookies"
                description="Learn about Cookie Heaven, our story, passion for baking, and our commitment to making fresh, delicious cookies using quality ingredients."
                keywords="Cookie Heaven, Freshly Baked Cookies, Premium Cookies, Handmade Cookies, Chocolate Chip Cookies, Buy Cookies Online, Bakery"
                canonical="https://www.cookieheaven.com/about"
            />


            {/* Our Story */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="bg-[#FFFDF8] rounded-[3rem] p-4 md:p-6 flex items-center justify-center relative border border-[var(--color-primary)]/10 shadow-sm overflow-hidden"
                        >
                            <img src={sweetImg} alt="Freshly baked cookies from Cookie Heaven" className="w-full h-full object-cover rounded-[2rem]" loading="lazy" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="section-title text-left mb-4">Our Sweet Journey</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Cookie Heaven started with a simple family recipe and a love for baking. Every cookie is made with fresh ingredients, rich chocolate, creamy butter, and lots of care to give you the perfect taste.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Today, we proudly offer a wide range of freshly baked cookies, including chocolate chip, double chocolate, butter, brownie, and many more. Every order is baked fresh and delivered with care.
                            </p>

                            <ul className="space-y-3 pt-4">
                                {['Sourced from premium local farms', '100% natural ingredients', 'Artisan bakers with 10+ years experience'].map((usp, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                                        <FiCheckCircle className="text-[var(--color-secondary)] text-xl" />
                                        {usp}
                                    </li>
                                ))}
                            </ul>

                            {/* Taste the Difference button removed as requested */}
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 bg-[var(--color-background)]">
                <div className="container mx-auto max-w-6xl text-center">
                    <h2 className="section-title mb-16">Our Core Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { t: 'Fresh Ingredients', d: 'We use high-quality ingredients for every cookie.', i: '🍪' },
                            { t: 'Baked Fresh', d: 'Every order is baked fresh before delivery.', i: '🔥' },
                            { t: 'Eco-Friendly', d: 'Our packaging is recyclable and environmentally friendly.', i: '🌱' },
                            { t: 'Customer First', d: 'Your happiness is our biggest priority.', i: '❤️' },
                        ].map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-primary)]/10 hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="text-5xl mb-4">{v.i}</div>
                                <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">{v.t}</h3>
                                <p className="text-gray-600">{v.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="text-4xl font-bold text-[var(--color-primary)] mb-6">
                        Why Choose Cookie Heaven?
                    </h2>
                    <p className="text-lg text-gray-700 leading-8">
                        At Cookie Heaven, we bake fresh cookies every day using quality ingredients. From classic chocolate chip cookies to rich double chocolate and buttery treats, we make every cookie with care to give you the best taste and freshness.
                    </p>
                </div>
            </section>

        </main>
    );
}
