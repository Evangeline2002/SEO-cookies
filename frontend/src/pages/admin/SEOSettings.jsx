import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getSEOSettings, updateSEOSetting } from '../../services/adminService';

const pageLabels = {
  home: 'Home', about: 'About', shop: 'Shop',
  recipes: 'Recipes', 'gift-boxes': 'Gift Boxes', contact: 'Contact',
};

export default function SEOSettings() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    getSEOSettings()
      .then(({ data }) => { setPages(data); if (data.length > 0) setActivePage(data[0]); })
      .catch(() => toast.error('Failed to load SEO settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!activePage) return;
    try {
      const { id, meta_title, meta_description, keywords, canonical_url } = activePage;
      await updateSEOSetting(id, { meta_title, meta_description, keywords, canonical_url });
      toast.success(`${pageLabels[activePage.page] || activePage.page} SEO settings saved`);
    } catch {
      toast.error('Failed to save');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">SEO Settings</h1>
        <p className="text-gray-400 mt-1">Manage meta tags for each page</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activePage?.id === page.id
                ? 'bg-[#8B4513] text-white shadow-lg shadow-[#8B4513]/30'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B4513]'
            }`}
          >
            {pageLabels[page.page] || page.page}
          </button>
        ))}
      </div>

      {activePage && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">{pageLabels[activePage.page] || activePage.page} Page SEO</h2>
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Meta Title</label>
              <input
                value={activePage.meta_title || ''}
                onChange={(e) => setActivePage({ ...activePage, meta_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Recommended: 50-60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Meta Description</label>
              <textarea
                value={activePage.meta_description || ''}
                onChange={(e) => setActivePage({ ...activePage, meta_description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Recommended: 150-160 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Keywords</label>
              <input
                value={activePage.keywords || ''}
                onChange={(e) => setActivePage({ ...activePage, keywords: e.target.value })}
                placeholder="cookie, bakery, gift box, ..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Comma separated keywords</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Canonical URL</label>
              <input
                value={activePage.canonical_url || ''}
                onChange={(e) => setActivePage({ ...activePage, canonical_url: e.target.value })}
                placeholder="https://www.cookieheaven.com/"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
              />
            </div>
          </div>
          <button onClick={handleSave} className="mt-6 px-6 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors text-sm">Save Changes</button>
        </div>
      )}
    </div>
  );
}
