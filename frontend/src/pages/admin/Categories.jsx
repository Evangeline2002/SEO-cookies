import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminService';

const defaultForm = { category_name: '', category_slug: '', description: '', display_order: '0', status: 'Active' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setImage(null); setShowModal(true); };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      category_name: cat.category_name,
      category_slug: cat.category_slug || '',
      description: cat.description || '',
      display_order: cat.display_order || '0',
      status: cat.status
    });
    setImage(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.category_name) { toast.error('Please enter a category name'); return; }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
      if (image) fd.append('category_image', image);

      if (editing) {
        await updateCategory(editing.id, fd);
        toast.success('Category updated');
      } else {
        await createCategory(fd);
        toast.success('Category added');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Categories</h1><p className="text-gray-400 mt-1">Organize your product categories</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-all duration-300 shadow-lg shadow-[#8B4513]/30 text-sm"><HiOutlinePlus className="w-4 h-4" /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col mb-3 space-y-3">
              {cat.category_image && <img src={`http://localhost:5000${cat.category_image}`} alt="" className="w-full h-32 rounded-lg object-cover" />}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{cat.category_name}</h3>
                  <p className="text-sm text-gray-400">Slug: {cat.category_slug}</p>
                  <p className="text-sm text-gray-400 font-bold mt-1">{cat.product_count || 0} Products</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{cat.status}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-50 mt-auto">
              <button onClick={() => openEdit(cat)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"><HiOutlinePencil className="w-4 h-4" /> Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"><HiOutlineTrash className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editing ? 'Edit Category' : 'Add Category'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category Name *</label>
                <input value={form.category_name} onChange={(e) => setForm({ ...form, category_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
                <input value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" placeholder="e.g., custom-cookies" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#8B4513]/10 file:text-[#8B4513] file:font-medium file:text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors">{editing ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
