import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

export default function CookieBanner({ showBanner, acceptAll, rejectAll, setShowSettings }) {
    if (!showBanner) return null;

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-[var(--color-primary-dark)] text-white p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t-[6px] border-[var(--color-accent)]"
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent notice"
        >
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                    <span className="text-4xl shrink-0">🍪</span>
                    <p className="text-sm md:text-base text-white/90 font-medium">
                        We use cookies to personalise content, analyse traffic and deliver
                        a better experience. You can accept, reject or choose your preferences.{' '}
                        <a href="/cookie-policy" className="text-[var(--color-accent)] hover:text-white underline decoration-2 underline-offset-4 transition-colors font-semibold">
                            Learn more
                        </a>
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
                    <button
                        className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-colors"
                        onClick={() => setShowSettings(true)}
                        aria-label="Manage cookie preferences"
                    >
                        Manage Preferences
                    </button>
                    <button
                        className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-colors"
                        onClick={rejectAll}
                        aria-label="Reject all cookies"
                    >
                        Reject All
                    </button>
                    <button
                        className="btn bg-[var(--color-accent)] hover:bg-[#FCD34D] text-[var(--color-primary-dark)] shadow-[0_4px_14px_#f59e0b66] px-6 py-2.5"
                        onClick={acceptAll}
                        aria-label="Accept all cookies"
                    >
                        Accept All 🍪
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function CookieSettings({ showSettings, setShowSettings, preferences, setPreferences, savePreferences }) {
    const [local, setLocal] = useState({ ...preferences });

    const togglePref = (key) => setLocal(p => ({ ...p, [key]: !p[key] }));

    const types = [
        { key: 'necessary', label: 'Necessary Cookies', desc: 'Required for the site to function. Cannot be disabled.', locked: true },
        { key: 'functional', label: 'Functional Cookies', desc: 'Enable enhanced features like saved preferences and chat support.' },
        { key: 'analytics', label: 'Analytics Cookies', desc: 'Help us understand how visitors interact with our site.' },
        { key: 'marketing', label: 'Marketing Cookies', desc: 'Used to show personalised ads and track campaign performance.' },
    ];

    return (
        <AnimatePresence>
            {showSettings && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Cookie settings"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
                                    <span>🍪</span> Cookie Preferences
                                </h2>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                    aria-label="Close settings"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 md:px-8 overflow-y-auto flex-1 bg-white">
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                                    Customise which cookies you allow us to use. You can change these settings at any time. Your choices will be saved in your browser for 1 year.
                                </p>

                                <div className="space-y-6">
                                    {types.map(t => (
                                        <div key={t.key} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-[var(--color-primary)]/20 transition-all">
                                            <div className="flex-1">
                                                <strong className="block text-lg text-[var(--color-primary-dark)] mb-1">{t.label}</strong>
                                                <span className="text-sm text-gray-600 leading-relaxed block">{t.desc}</span>
                                            </div>
                                            <button
                                                className={`
                          relative shrink-0 w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]
                          ${local[t.key] ? 'bg-[var(--color-secondary)]' : 'bg-gray-300'}
                          ${t.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                                                onClick={() => !t.locked && togglePref(t.key)}
                                                disabled={t.locked}
                                                aria-checked={local[t.key]}
                                                role="switch"
                                                aria-label={`Toggle ${t.label}`}
                                            >
                                                <span
                                                    className={`
                            absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow flex items-center justify-center
                            ${local[t.key] ? 'left-[26px]' : 'left-1'}
                          `}
                                                >
                                                    {local[t.key] && <FiCheck className="text-[var(--color-secondary)] w-4 h-4" />}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row justify-end gap-3 rounded-b-3xl">
                                <button
                                    className="px-6 py-3 rounded-full font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                                    onClick={() => setShowSettings(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary px-8 shadow-md hover:shadow-xl"
                                    onClick={() => savePreferences(local)}
                                >
                                    Save Preferences
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
