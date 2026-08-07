import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCake, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { loginAdmin } from '../../services/adminService';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginAdmin({ email, password });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      if (remember) {
        localStorage.setItem('adminRemember', 'true');
      } else {
        localStorage.removeItem('adminRemember');
      }
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B4513] text-white text-3xl mb-4">
              <HiOutlineCake />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-400 mt-2">Sign in to manage Cookie Heaven</p>
          </div>

          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Login ID</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cookies123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#8B4513] focus:ring-[#8B4513]/20"
                  />
                  <span className="text-sm text-gray-600">Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-[#8B4513] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-all duration-300 shadow-lg shadow-[#8B4513]/30 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Login ID</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cookies123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-all bg-white"
                />
              </div>
              <button
                onClick={() => {
                  if (!email) { toast.error('Please enter your email'); return; }
                  toast.success('Reset link sent to your email (demo)');
                  setShowForgot(false);
                }}
                className="w-full py-3 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-all duration-300 shadow-lg shadow-[#8B4513]/30"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowForgot(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Back to Login
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            <a href="/" className="text-[#8B4513] hover:underline">← Back to Website</a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#8B4513] to-[#6e350d] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F59E0B] rounded-full blur-3xl" />
        </div>
        <div className="relative text-center text-white max-w-md">
          <HiOutlineCake className="w-24 h-24 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Cookie Heaven</h2>
          <p className="text-lg opacity-80">Where every cookie tells a story of warmth, love, and the finest ingredients.</p>
        </div>
      </div>
    </div>
  );
}
