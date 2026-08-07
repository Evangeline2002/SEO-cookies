import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getGiftBoxes, createGiftBox, updateGiftBox, deleteGiftBox } from '../../services/adminService';

export default function GiftBoxes() {
  const [boxes, setBoxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', items: '', price: '', status: 'Active' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    getGiftBoxes().then(({ data }) => setBoxes(data)).catch(() => toast.error('Failed to load gift boxes')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', items: '', price: '', status: 'Active' }); setImage(null); setShowModal(true); };
  const openEdit = (b) => { setEditing(b); setForm({ name: b.name, description: b.description || '', items: b.items, price: b.price, status: b.status }); setImage(null); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
      if (image) fd.append('image', image);
      if (editing) { await updateGiftBox(editing.id, fd); toast.success('Gift box updated'); }
      else { await createGiftBox(fd); toast.success('Gift box added'); }
      setShowModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gift box?')) return;
    try { await deleteGiftBox(id); toast.success('Gift box deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Gift Boxes</h1><p className="text-gray-400 mt-1">Curate your gift box collections</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-all duration-300 shadow-lg shadow-[#8B4513]/30 text-sm"><HiOutlinePlus className="w-4 h-4" /> Add Gift Box</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes.map((box) => (
          <div key={box.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {box.image && <img src={`http://localhost:5000${box.image}`} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                <h3 className="font-semibold text-gray-800">{box.name}</h3>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${box.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{box.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{box.items} items</span>
              <span className="font-semibold text-gray-800">${Number(box.price).toFixed(2)}</span>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-50">
              <button onClick={() => openEdit(box)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"><HiOutlinePencil className="w-4 h-4" /> Edit</button>
              <button onClick={() => handleDelete(box.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"><HiOutlineTrash className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editing ? 'Edit Gift Box' : 'Add Gift Box'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Box Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Items *</label><input type="number" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Price *</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Image</label><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#8B4513]/10 file:text-[#8B4513] file:font-medium file:text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-600 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white"><option>Active</option><option>Inactive</option></select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d]">{editing ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
