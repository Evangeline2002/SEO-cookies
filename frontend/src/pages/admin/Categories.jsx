import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', status: 'Active' });
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', status: 'Active' }); setShowModal(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, status: cat.status }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Please enter a category name'); return; }
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
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
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="font-semibold text-gray-800">{cat.name}</h3><p className="text-sm text-gray-400">{cat.product_count || 0} products</p></div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{cat.status}</span>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-50">
              <button onClick={() => openEdit(cat)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"><HiOutlinePencil className="w-4 h-4" /> Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"><HiOutlineTrash className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editing ? 'Edit Category' : 'Add Category'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Category Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white"><option>Active</option><option>Inactive</option></select></div>
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
