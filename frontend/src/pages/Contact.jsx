import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import SEO from '../components/SEO';

export default function Contact() {
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        // Mock submit
        setTimeout(() => {
            setStatus('Message sent successfully! We will get back to you soon.');
            e.target.reset();
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <SEO
                title="Contact Us | Cookie Heaven"
                description="Get in touch with Cookie Heaven for corporate orders, custom gift boxes, or general inquiries."
            />

            {/* Header */}
            <section className="bg-[var(--color-primary)] text-white pt-20 pb-16 px-4 text-center">
                <div className="container mx-auto max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">Contact Us</h1>
                    <p className="text-white/80 text-lg">Have a question or a special request? We'd love to hear from you.</p>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="space-y-10"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Get In Touch</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    Whether you're looking for custom corporate gifts, catering for a wedding, or just want to say hi, our team is always ready to help.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                            <FiMapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">Our Bakery</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                123 Bakery Lane, Dessert District<br />
                                                New Delhi, 110001, India
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                            <FiPhone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">Phone Number</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                <a href="tel:+919876543210" className="hover:text-[var(--color-primary)] transition-colors">+91 98765 43210</a><br />
                                                Mon-Fri, 9am - 6pm
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                            <FiMail size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">Email Address</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                <a href="mailto:hello@cookieheaven.com" className="hover:text-[var(--color-primary)] transition-colors">hello@cookieheaven.com</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-[var(--color-primary)]/5 border border-gray-100"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors" placeholder="John" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                                    <select required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-gray-700">
                                        <option value="">Select a topic</option>
                                        <option value="General">General Inquiry</option>
                                        <option value="Order">Order Status</option>
                                        <option value="Corporate">Corporate / Custom Orders</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea required rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors resize-none" placeholder="How can we help you?"></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-4" disabled={status === 'Sending...'}>
                                    {status === 'Sending...' ? 'Sending...' : <><FiSend /> Send Message</>}
                                </button>

                                {status && status !== 'Sending...' && (
                                    <p className="text-green-600 font-medium text-center bg-green-50 py-3 rounded-lg mt-4">{status}</p>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map (Visual placeholder for SEO) */}
            <section className="h-[400px] w-full bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-[#FFFDF8] border-t border-[var(--color-primary)]/10">
                    <div className="text-center p-8">
                        <FiMapPin className="mx-auto text-5xl text-[var(--color-secondary)] mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Cookie Heaven HQ</h3>
                        <p className="text-gray-500">Google Map Integration Area</p>
                    </div>
                </div>
            </section>

        </main>
    );
}
