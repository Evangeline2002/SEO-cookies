import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineEye, HiOutlineTrash, HiOutlinePencilAlt, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getOrders, updateOrder, deleteOrder } from '../../services/adminService';

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const paymentStatusColors = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
  Refunded: 'bg-gray-100 text-gray-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Latest Orders');
  const [loading, setLoading] = useState(true);

  const [viewOrder, setViewOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    getOrders({ search, status: filter === 'All' ? undefined : filter, sort })
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [search, filter, sort]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(statusModal.id, {
        order_status: statusModal.order_status,
        payment_status: statusModal.payment_status,
      });
      toast.success('Order updated successfully');
      setStatusModal(null);
      fetchOrders();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const formatAddress = (order) => {
    const parts = [order.address, order.city, order.state, order.postal_code].filter(Boolean);
    return parts.join(', ') || '-';
  };

  const summarizeProducts = (items) => {
    if (!items || items.length === 0) return '-';
    if (items.length === 1) return items[0].product_name;
    return `${items[0].product_name} + ${items.length - 1} more`;
  };

  const summarizeQuantity = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-400 mt-1">View, track, and manage all customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Name, Email, or Phone..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort By:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] outline-none bg-white text-sm cursor-pointer"
            >
              <option>Latest Orders</option>
              <option>Oldest Orders</option>
              <option>Highest Amount</option>
              <option>Lowest Amount</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-50">
          <span className="text-sm font-medium text-gray-500 py-2 mr-2">Filter Status:</span>
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${filter === s ? 'bg-[#8B4513] text-white shadow-lg shadow-[#8B4513]/30 scale-105' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B4513] hover:text-[#8B4513]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Order ID</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Customer Name</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Email</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Phone Number</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Order Number</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Order Date</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Product Name</th>
                  <th className="text-center px-5 py-4 font-semibold text-gray-500">Quantity</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Total Amount</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Payment Method</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Payment Status</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Order Status</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Delivery Address</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-800">{order.id}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{order.customer_name}</td>
                    <td className="px-5 py-4 text-gray-600">{order.email || '-'}</td>
                    <td className="px-5 py-4 text-gray-600">{order.phone || '-'}</td>
                    <td className="px-5 py-4 font-bold text-[#8B4513]">#{order.order_number}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-gray-600 truncate max-w-[180px]">{summarizeProducts(order.items)}</td>
                    <td className="px-5 py-4 text-center font-medium text-gray-700">{summarizeQuantity(order.items)}</td>
                    <td className="px-5 py-4 font-bold text-[#8B4513]">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-5 py-4 text-gray-600">{order.payment_method || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-500'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[order.order_status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs max-w-[200px] truncate">{formatAddress(order)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewOrder(order)} title="View Details" className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#8B4513] hover:text-white transition-colors duration-200"><HiOutlineEye className="w-4 h-4" /></button>
                        <button onClick={() => setStatusModal(order)} title="Update Status" className="p-2 rounded-lg bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"><HiOutlinePencilAlt className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(order.id)} title="Delete Order" className="p-2 rounded-lg bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="14" className="px-6 py-16 text-center text-gray-400 font-medium">No orders found matching your criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- View Details Modal --- */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setViewOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <p className="text-sm text-gray-500 mt-1">Order #{viewOrder.order_number} &bull; {new Date(viewOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">&#10005;</button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Customer, Address & Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h4>
                  <p className="font-semibold text-gray-800 text-lg mb-2">{viewOrder.customer_name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-1"><HiOutlineMail className="w-4 h-4 text-gray-400" /> {viewOrder.email || '-'}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><HiOutlinePhone className="w-4 h-4 text-gray-400" /> {viewOrder.phone || '-'}</p>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Address</h4>
                  <p className="text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
                    <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>
                      {viewOrder.address || '-'} <br />
                      {viewOrder.city && `${viewOrder.city}, `} {viewOrder.state} {viewOrder.postal_code}
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColors[viewOrder.order_status] || 'bg-gray-200'}`}>{viewOrder.order_status}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Payment</span>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{viewOrder.payment_method}</p>
                        <p className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${viewOrder.payment_status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>&bull; {viewOrder.payment_status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Ordered Products</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Product</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600">Price</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600">Quantity</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(viewOrder.items || []).map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.product_image ? (
                                <img src={`http://localhost:5000${item.product_image}`} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                              )}
                              <span className="font-medium text-gray-800">{item.product_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">${Number(item.price).toFixed(2)}</td>
                          <td className="py-3 px-4 text-center font-medium text-gray-700">&times; {item.quantity}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-800">${Number(item.subtotal).toFixed(2)}</td>
                        </tr>
                      ))}
                      {(viewOrder.items || []).length === 0 && (
                        <tr><td colSpan="4" className="py-8 text-center text-gray-400">No items found for this order.</td></tr>
                      )}
                    </tbody>
                  </table>

                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>${Number(viewOrder.total_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-black text-[#8B4513] pt-3 border-t border-gray-200 mt-2">
                        <span>Grand Total</span>
                        <span>${Number(viewOrder.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 mt-auto">
              <button
                onClick={() => setViewOrder(null)}
                className="w-full py-2.5 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 shadow-md transition-all duration-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Update Status Modal --- */}
      {statusModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setStatusModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Update Order</h3>
              <p className="text-sm text-gray-500 mt-1">For Order #{statusModal.order_number}</p>
            </div>

            <form onSubmit={handleStatusChange}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white font-medium text-gray-800"
                  value={statusModal.order_status}
                  onChange={(e) => setStatusModal({ ...statusModal, order_status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white font-medium text-gray-800"
                  value={statusModal.payment_status}
                  onChange={(e) => setStatusModal({ ...statusModal, payment_status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStatusModal(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#8B4513] text-white font-bold hover:bg-[#6e350d] shadow-lg shadow-[#8B4513]/30 transition-all duration-300">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
