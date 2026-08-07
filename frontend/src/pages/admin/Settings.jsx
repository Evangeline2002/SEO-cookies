import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getWebsiteSettings, updateWebsiteSettings } from '../../services/adminService';

export default function Settings() {
  const [form, setForm] = useState({
    site_name: 'Cookie Heaven',
    tagline: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWebsiteSettings()
      .then(({ data }) => setForm(data))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (section) => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null) fd.append(k, v); });
      if (logo) fd.append('logo', logo);
      await updateWebsiteSettings(fd);
      toast.success(`${section} saved successfully`);
    } catch {
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Website Settings</h1>
        <p className="text-gray-400 mt-1">Manage your website settings</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Website Name & Logo</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Site Name</label>
              <input value={form.site_name || ''} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Tagline</label>
              <input value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Logo</label>
              <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#8B4513]/10 file:text-[#8B4513] file:font-medium file:text-sm" />
            </div>
          </div>
          <button onClick={() => handleSave('Website settings')} className="mt-4 px-6 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors text-sm">Save Changes</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input value={form.contact_email || ''} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone</label>
              <input value={form.contact_phone || ''} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Address</label>
              <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
          </div>
          <button onClick={() => handleSave('Contact details')} className="mt-4 px-6 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors text-sm">Save Changes</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Facebook URL</label>
              <input value={form.facebook_url || ''} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Instagram URL</label>
              <input value={form.instagram_url || ''} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Twitter URL</label>
              <input value={form.twitter_url || ''} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
            </div>
          </div>
          <button onClick={() => handleSave('Social links')} className="mt-4 px-6 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
