import { useState, useEffect } from 'react';
import { HiOutlineCake, HiOutlineMail, HiOutlineUser } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getAdminProfile, updateAdminProfile } from '../../services/adminService';

export default function AdminProfile() {
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProfile()
      .then(({ data }) => setForm(f => ({ ...f, name: data.name, email: data.email })))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await updateAdminProfile(form);
      toast.success('Profile updated');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Admin Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#8B4513] flex items-center justify-center text-white text-2xl">
              <HiOutlineCake />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{form.name || 'Admin'}</h2>
              <p className="text-sm text-gray-400">{form.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Current Password</label>
              <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
                <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="mt-6 px-6 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
