import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';
import SEO from '../components/SEO';
import heroImg from '../assets/hero.png';
import logoImg from '../assets/logo.webp';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { fullName: '', email: '', mobile: '', password: '', confirmPassword: '' }
    });

    const onSubmit = (data) => {
        setLoading(true);
        setTimeout(() => {
            toast.success(
                <div>
                    <div className="font-semibold text-gray-900">Registration Successful!</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                        Your account has been created successfully.
                    </div>
                </div>,
                { icon: <span className="text-xl">✅</span>, style: { borderRadius: '16px', padding: '16px 20px' } }
            );
            setLoading(false);
            setTimeout(() => navigate('/login'), 2000);
        }, 1500);
    };

    return (
        <main className="min-h-screen flex" style={{ backgroundColor: '#FFF8F2' }}>
            <SEO title="Cookie Heaven | Register" description="Create an account to start shopping freshly baked premium cookies." />

            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #FFF8F2 0%, #FEF0E0 40%, #FDE8D0 100%)' }}>
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[12%] left-[8%] text-6xl opacity-[0.15]">🍪</motion.div>
                    <motion.div animate={{ y: [0, 24, 0], rotate: [0, -18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[30%] right-[10%] text-5xl opacity-[0.12]">🍫</motion.div>
                    <motion.div animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[20%] left-[15%] text-7xl opacity-[0.10]">🥛</motion.div>
                    <motion.div animate={{ y: [0, 16, 0], rotate: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[35%] right-[6%] text-4xl opacity-[0.12]">✨</motion.div>
                    <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.18, 0.1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative z-10">
                    <div className="relative">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -inset-4 rounded-[3.5rem] opacity-30 blur-2xl" style={{ background: 'linear-gradient(135deg, #8B4513, #D97706)' }} />
                        <img src={heroImg} alt="Freshly baked premium cookies" className="w-full max-w-lg rounded-[2.5rem] shadow-2xl border-8 border-white/70 relative z-10" style={{ boxShadow: '0 25px 60px rgba(139,69,19,0.2)' }} />
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-5 py-12 lg:py-16">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[440px]">
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group" aria-label="Cookie Heaven Home">
                            <motion.img whileHover={{ rotate: [0, -15, 15, -10, 0], scale: 1.1 }} transition={{ duration: 0.5 }} src={logoImg} className="h-16 w-16 rounded-full object-cover border-2 border-[var(--color-primary)]/10 shadow-md" alt="Cookie Heaven Logo" />
                            <span className="font-bold text-3xl tracking-tight" style={{ color: '#8B4513' }}>Cookie Heaven</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#5C2D0A' }}>Create Your Account</h1>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">Register to start shopping freshly baked premium cookies.</p>
                    </motion.div>

                    <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: errors.fullName ? '#EF4444' : '#9CA3AF' }} />
                                <input type="text" {...register('fullName', { required: 'Full Name is required' })} placeholder="Full Name" className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all outline-none text-sm ${errors.fullName ? 'border-red-400 bg-red-50 focus:bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`} style={{ color: '#2D2D2D' }} />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: errors.email ? '#EF4444' : '#9CA3AF' }} />
                                <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address' } })} placeholder="Email Address" className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all outline-none text-sm ${errors.email ? 'border-red-400 bg-red-50 focus:bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`} style={{ color: '#2D2D2D' }} />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: errors.mobile ? '#EF4444' : '#9CA3AF' }} />
                                <input type="tel" {...register('mobile', { required: 'Mobile number is required', pattern: { value: /^\d{10}$/, message: 'Mobile number must contain 10 digits' } })} placeholder="Mobile Number" className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all outline-none text-sm ${errors.mobile ? 'border-red-400 bg-red-50 focus:bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`} style={{ color: '#2D2D2D' }} />
                            </div>
                            {errors.mobile && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile.message}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: errors.password ? '#EF4444' : '#9CA3AF' }} />
                                <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} placeholder="Password" className={`w-full pl-12 pr-12 py-3 rounded-2xl border-2 transition-all outline-none text-sm ${errors.password ? 'border-red-400 bg-red-50 focus:bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`} style={{ color: '#2D2D2D' }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: errors.confirmPassword ? '#EF4444' : '#9CA3AF' }} />
                                <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword', { required: 'Confirm Password is required', validate: value => value === watch('password') || 'Passwords do not match' })} placeholder="Confirm Password" className={`w-full pl-12 pr-12 py-3 rounded-2xl border-2 transition-all outline-none text-sm ${errors.confirmPassword ? 'border-red-400 bg-red-50 focus:bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B4513]'}`} style={{ color: '#2D2D2D' }} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <motion.button type="submit" disabled={loading} whileHover={loading ? {} : { scale: 1.02, y: -1 }} whileTap={loading ? {} : { scale: 0.98 }} className="w-full py-3 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2.5 transition-all mt-6" style={{ background: loading ? 'linear-gradient(135deg, #A0522D, #8B4513)' : 'linear-gradient(135deg, #8B4513, #A0522D)', boxShadow: loading ? 'none' : '0 8px 24px rgba(139,69,19,0.35)' }}>
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <FiArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.p variants={itemVariants} className="text-center text-gray-500 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold transition-all hover:underline underline-offset-2" style={{ color: '#8B4513' }}>
                            Sign In
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
}
