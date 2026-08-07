import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import { blogPosts, blogCategories } from '../utils/blogData';
import SEO from '../components/SEO';

export default function Blog({ isRecipe = false }) {
    const [activeCategory, setActiveCategory] = useState(isRecipe ? 'Cookie Recipes' : 'All');

    const filteredPosts = blogPosts.filter(post => {
        if (isRecipe) return post.category === 'Cookie Recipes';
        if (activeCategory === 'All') return true;
        return post.category === activeCategory;
    });

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <SEO
                title={isRecipe ? "Cookie Recipes | Cookie Heaven" : "Blog | Cookie Heaven"}
                description={isRecipe ? "Learn how to bake the best cookies with our secret recipes." : "Read the latest news, baking tips, and trends from Cookie Heaven."}
            />

            <section className="bg-[var(--color-primary)] text-white pt-20 pb-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-6 block">
                        {isRecipe ? "Secret Cookie Recipes" : "The Cookie Heaven Blog"}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        {isRecipe
                            ? "Bring the heavenly taste of our bakery into your own kitchen with our step-by-step guides."
                            : "Discover baking tips, new flavor trends, gifting guides, and stories from our kitchen."}
                    </p>
                </div>
            </section>

            <section className="py-12 px-4">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    {!isRecipe && (
                        <aside className="w-full md:w-64 shrink-0 space-y-8">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg text-[var(--color-primary-dark)] mb-4 uppercase tracking-wider">Categories</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            className={`text-left w-full px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === 'All' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'}`}
                                            onClick={() => setActiveCategory('All')}
                                        >All Posts</button>
                                    </li>
                                    {blogCategories.map(cat => (
                                        <li key={cat}>
                                            <button
                                                className={`text-left w-full px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'}`}
                                                onClick={() => setActiveCategory(cat)}
                                            >{cat}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    )}

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {filteredPosts.map((post, i) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[var(--color-primary)]/10 flex flex-col group hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300"
                                >
                                    <div className="h-56 bg-[#FFFDF8] flex items-center justify-center text-7xl border-b border-gray-100 relative group-hover:bg-[#FFF0E0] transition-colors">
                                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                            {post.emoji}
                                        </motion.div>
                                        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-gray-200">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                                            <span className="flex items-center gap-1"><FiUser /> {post.author}</span>
                                            <span className="flex items-center gap-1"><FiClock /> {post.readTime}</span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>

                                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                                            {post.excerpt}
                                        </p>

                                        <Link to={`/blog/${post.slug}`} className="mt-auto inline-flex items-center font-bold text-[var(--color-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm w-fit group/link">
                                            Read More <FiArrowRight className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-gray-500">No posts found in this category.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}
