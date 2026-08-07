import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import SEO from '../components/SEO';
import { faqSchema } from '../utils/structuredData';

const faqs = [
    {
        question: "Do you offer vegan or gluten-free options?",
        answer: "Yes! We have a dedicated selection of 100% vegan cookies and gluten-free cookies baked in a special sanitized area to prevent cross-contamination. Check our 'Healthy & Vegan' category."
    },
    {
        question: "How long do the cookies stay fresh?",
        answer: "Our cookies are baked fresh with no preservatives. They maintain peak freshness for 5-7 days when stored in an airtight container at room temperature. You can also freeze them for up to 2 months!"
    },
    {
        question: "Do you deliver pan-India?",
        answer: "Yes, we partner with premium logistics providers to deliver pan-India. Express delivery (next day) is available in most metro cities."
    },
    {
        question: "What is your return policy?",
        answer: "Because our cookies are perishable goods, we do not accept returns. However, if your order arrives damaged or incorrect, please snap a photo and contact us within 24 hours for a full replacement."
    },
    {
        question: "Do you take corporate or bulk orders for weddings?",
        answer: "Absolutely! We do custom packaging, personalized notes, and bulk discounts. Head over to our Contact page and select 'Corporate / Custom Orders' in the subject line."
    }
];

export default function FAQ() {
    const [openId, setOpenId] = useState(0);

    return (
        <main className="min-h-screen bg-[#FFFDF8]">
            <SEO
                title="FAQ | Cookie Heaven"
                description="Frequently asked questions about Cookie Heaven deliveries, orders, ingredients and vegan options."
                schema={faqSchema(faqs)}
            />

            <section className="pt-24 pb-16 px-4 text-center">
                <div className="container mx-auto max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[var(--color-primary)] mb-6">Got Questions?</h1>
                    <p className="text-lg text-gray-600">Find answers to our most commonly asked questions below.</p>
                </div>
            </section>

            <section className="pb-24 px-4">
                <div className="container mx-auto max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenId(openId === i ? -1 : i)}
                                    className="w-full px-6 py-5 md:p-8 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
                                >
                                    <span className="font-bold text-lg text-[var(--color-primary-dark)] pr-6">{faq.question}</span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openId === i ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <FiChevronDown className={`transition-transform duration-300 ${openId === i ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openId === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 pt-0 text-gray-600 leading-relaxed text-lg border-t border-gray-50">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <a href="/contact" className="btn btn-outline">Contact Support</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
