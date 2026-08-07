import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.webp';
import loginImg from '../assets/login.jpg';
import SEO from '../components/SEO';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 15 } }
};

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: '', password: '', remember: false }
    });

    const onSubmit = (data) => {
        setLoading(true);
        setTimeout(() => {
            login(data.email.split('@')[0], data.email);
            toast.success(
                <div>
                    <div className="font-semibold text-gray-900">Login Successful!</div>
                    <div className="text-sm text-gray-500 mt-0.5">Welcome back to Cookie Heaven.</div>
                </div>,
                { icon: <span className="text-xl">✅</span>, style: { borderRadius: '16px', padding: '16px 20px' } }
            );
            setLoading(false);
            setTimeout(() => navigate('/'), 1800);
        }, 1500);
    };

    return (
        <main className="min-h-screen flex" style={{ backgroundColor: '#FFF8F2' }}>
            <SEO
                title="Login | Cookie Heaven"
                description="Login to Cookie Heaven and enjoy freshly baked premium cookies with a simple and secure shopping experience."
                keywords="Cookie Heaven Login, Cookie Store, Premium Cookies, Freshly Baked Cookies, Online Bakery"
            />

            {/* Left - Image */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12"
                style={{ background: 'linear-gradient(160deg, #FFF8F2 0%, #FEF0E0 50%, #FDE8D0 100%)' }}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[{ emoji: '🍪', top: '12%', left: '8%', dur: 5 }, { emoji: '🍫', top: '30%', right: '10%', dur: 7 }, { emoji: '🥛', bottom: '20%', left: '15%', dur: 6 }, { emoji: '✨', bottom: '35%', right: '6%', dur: 8 }].map((e, i) => (
                        <motion.div key={i}
                            animate={{ y: [0, -16, 0] }}
                            transition={{ duration: e.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                            className="absolute text-5xl opacity-[0.12]"
                            style={{ top: e.top, left: e.left, right: e.right, bottom: e.bottom }}
                        >{e.emoji}</motion.div>
                    ))}
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -inset-4 rounded-[3.5rem] opacity-30 blur-2xl"
                        style={{ background: 'linear-gradient(135deg, #8B4513, #D97706)' }}
                    />
                    <img src={loginImg} alt="Cookie Heaven premium cookies" className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-8 border-white/70 relative z-10 object-cover aspect-[4/5]"
                        style={{ boxShadow: '0 25px 60px rgba(139,69,19,0.2)' }} />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                    className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-white/60">
                    <span className="text-2xl">🏆</span>
                    <div>
                        <p className="font-semibold text-sm" style={{ color: '#8B4513' }}>Premium Bakery</p>
                        <p className="text-xs text-gray-400">Since 2020</p>
                    </div>
                </motion.div>
            </div>

            {/* Right - Form */}
            <div className="flex-1 flex items-center justify-center px-5 py-16 lg:py-20">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[420px]">
                    {/* Logo & Header */}
                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group" aria-label="Cookie Heaven Home">
                            <motion.img whileHover={{ rotate: [0, -15, 15, -10, 0], scale: 1.1 }} transition={{ duration: 0.5 }}
                                src={logoImg} className="h-16 w-16 rounded-full object-cover border-2 border-[#8B4513]/10 shadow-md" alt="Cookie Heaven Logo" />
                            <span className="font-bold text-3xl tracking-tight" style={{ color: '#8B4513' }}>Cookie Heaven</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#5C2D0A' }}>Welcome Back</h1>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                            Login to continue shopping your favorite freshly baked cookies.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#4A4A4A' }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2" size={18}
                                    style={{ color: errors.email ? '#EF4444' : '#9CA3AF' }} />
                                <input
                                    id="email" type="email" autoComplete="email"
                                    aria-label="Email Address" aria-invalid={errors.email ? 'true' : 'false'}
                                    {...register('email', {
                                        required: 'Email is required.',
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address.' }
                                    })}
                                    placeholder="Enter your email"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all outline-none text-sm
                                        ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`}
                                    style={{ color: '#2D2D2D' }}
                                />
                            </div>
                            {errors.email && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-xs mt-1.5 ml-1 font-medium" role="alert">
                                    {errors.email.message}
                                </motion.p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#4A4A4A' }}>
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2" size={18}
                                    style={{ color: errors.password ? '#EF4444' : '#9CA3AF' }} />
                                <input
                                    id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                                    aria-label="Password" aria-invalid={errors.password ? 'true' : 'false'}
                                    {...register('password', {
                                        required: 'Password is required.',
                                        minLength: { value: 8, message: 'Password must contain at least 8 characters.' }
                                    })}
                                    placeholder="Enter your password"
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 transition-all outline-none text-sm
                                        ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`}
                                    style={{ color: '#2D2D2D' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-xs mt-1.5 ml-1 font-medium" role="alert">
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input type="checkbox" {...register('remember')} className="w-4 h-4 rounded"
                                    style={{ accentColor: '#8B4513' }} />
                                <span className="text-gray-500">Remember me</span>
                            </label>
                            <Link to="/" className="font-semibold hover:underline underline-offset-2 transition-all" style={{ color: '#8B4513' }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <motion.button type="submit" disabled={loading}
                            whileHover={loading ? {} : { scale: 1.02, y: -1 }}
                            whileTap={loading ? {} : { scale: 0.98 }}
                            className="w-full py-3.5 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                                boxShadow: loading ? 'none' : '0 8px 24px rgba(139,69,19,0.35)'
                            }}>
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FiArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Bottom Text */}
                    <motion.p variants={itemVariants} className="text-center text-gray-500 mt-8 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold hover:underline underline-offset-2 transition-all" style={{ color: '#8B4513' }}>
                            Create Account
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
}
