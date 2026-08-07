import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../../services/adminService';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', description: '', ingredients: '', instructions: '', status: 'Draft' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    getRecipes().then(({ data }) => setRecipes(data)).catch(() => toast.error('Failed to load recipes')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', author: '', description: '', ingredients: '', instructions: '', status: 'Draft' }); setImage(null); setShowModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ title: r.title, author: r.author || '', description: r.description || '', ingredients: r.ingredients || '', instructions: r.instructions || '', status: r.status }); setImage(null); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title) { toast.error('Recipe title is required'); return; }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
      if (image) fd.append('image', image);
      if (editing) { await updateRecipe(editing.id, fd); toast.success('Recipe updated'); }
      else { await createRecipe(fd); toast.success('Recipe added'); }
      setShowModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try { await deleteRecipe(id); toast.success('Recipe deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Recipes</h1><p className="text-gray-400 mt-1">Manage your cookie recipes</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-all duration-300 shadow-lg shadow-[#8B4513]/30 text-sm"><HiOutlinePlus className="w-4 h-4" /> Add Recipe</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 font-semibold text-gray-500">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500">Author</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500">Date</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{recipe.title}</td>
                  <td className="px-6 py-4 text-gray-600">{recipe.author || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${recipe.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{recipe.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(recipe.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(recipe)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(recipe.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {recipes.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No recipes found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editing ? 'Edit Recipe' : 'Add Recipe'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Recipe Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Author</label><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Ingredients</label><textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Instructions</label><textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows="4" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Image</label><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#8B4513]/10 file:text-[#8B4513] file:font-medium file:text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white"><option>Draft</option><option>Published</option></select></div>
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
