import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/adminService';
import api from '../../services/api';

export default function Products() {
  const imgBaseUrl = api.defaults.baseURL.replace('/api', '');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const defaultForm = {
    product_name: '', category_id: '', product_slug: '', short_description: '',
    description: '', price: '', offer_price: '', stock: '', sku: '',
    weight: '', ingredients: '', tags: '', best_seller: false,
    featured: false, new_arrival: false, status: 'Active'
  };
  const [form, setForm] = useState(defaultForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ search })
      .then(({ data }) => setProducts(data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search]);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => { });
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setImage(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      product_name: product.product_name,
      category_id: product.category_id || '',
      product_slug: product.product_slug || '',
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price,
      offer_price: product.offer_price || '',
      stock: product.stock || '',
      sku: product.sku || '',
      weight: product.weight || '',
      ingredients: product.ingredients || '',
      tags: product.tags || '',
      best_seller: Boolean(product.best_seller),
      featured: Boolean(product.featured),
      new_arrival: Boolean(product.new_arrival),
      status: product.status || 'Active'
    });
    setImage(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.product_name || !form.price) { toast.error('Name and price are required'); return; }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v === true) fd.append(k, 1);
        else if (v === false) fd.append(k, 0);
        else if (v !== '' && v !== null) fd.append(k, v);
      });
      if (image) fd.append('product_image', image);

      if (editingProduct) {
        await updateProduct(editingProduct.id, fd);
        toast.success('Product updated');
      } else {
        await createProduct(fd);
        toast.success('Product added');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-400 mt-1">Manage your product inventory</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-all duration-300 shadow-lg shadow-[#8B4513]/30 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Price</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Stock</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Status</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.product_image && <img src={`${imgBaseUrl}${product.product_image}`} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{product.product_name}</span>
                          <span className="text-xs text-gray-400">SKU: {product.sku || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category_name || '-'}</td>
                    <td className="px-6 py-4 text-gray-800">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
                  <input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
                  <input value={form.product_slug} onChange={(e) => setForm({ ...form, product_slug: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" placeholder="auto-generated-if-empty" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white">
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Short Description</label>
                <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Weight</label><input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" placeholder="e.g. 50g" /></div>
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Tags</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" placeholder="comma separated" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Ingredients</label>
                <textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Offer Price</label>
                  <input type="number" step="0.01" value={form.offer_price} onChange={(e) => setForm({ ...form, offer_price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.best_seller} onChange={(e) => setForm({ ...form, best_seller: e.target.checked })} className="rounded text-[#8B4513] focus:ring-[#8B4513]" /><span className="text-sm font-medium text-gray-700">Best Seller</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded text-[#8B4513] focus:ring-[#8B4513]" /><span className="text-sm font-medium text-gray-700">Featured</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.new_arrival} onChange={(e) => setForm({ ...form, new_arrival: e.target.checked })} className="rounded text-[#8B4513] focus:ring-[#8B4513]" /><span className="text-sm font-medium text-gray-700">New Arrival</span></label>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#8B4513]/10 file:text-[#8B4513] file:font-medium file:text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold hover:bg-[#6e350d] transition-colors">{editingProduct ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
