import { useState, useEffect } from 'react';
import { HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineUsers, HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineEye } from 'react-icons/hi';
import SummaryCard from '../../components/admin/SummaryCard';
import { getDashboardStats } from '../../services/adminService';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

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

const PIE_COLORS = ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2B48C'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const summaryData = [
    { title: 'Total Revenue', value: `$${Number(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: HiOutlineCurrencyDollar },
    { title: 'Total Orders', value: stats?.totalOrders ?? 0, icon: HiOutlineClipboardList },
    { title: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: HiOutlineUsers },
    { title: 'Total Products', value: stats?.totalProducts ?? 0, icon: HiOutlineShoppingBag },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's the latest overview of Cookie Heaven.</p>
      </div>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* --- Order Status Summary & Analytics Overview --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Analytics Main Graph (Revenue & Orders) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Monthly Revenue & Orders Overview</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.analytics?.monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B4513" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ stroke: '#D2B48C', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#8B4513" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Cards & Mini Customer Growth */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Status Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                <div key={status} className={`p-4 rounded-xl border ${statusColors[status]?.replace('bg-', 'bg-opacity-20 border-').split(' ')[0]} bg-opacity-10 col-span-${status === 'Pending' ? 2 : 1}`}>
                  <p className="text-sm font-medium text-gray-600 mb-1">{status}</p>
                  <p className={`text-2xl font-bold ${statusColors[status]?.split(' ')[1]}`}>{stats?.orderStatusSummary?.[status] || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-48">
            <h2 className="text-sm font-bold text-gray-800 mb-2">Customer Growth</h2>
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={stats?.analytics?.customerGrowth || []}>
                  <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="customers" stroke="#DEB887" strokeWidth={3} dot={{ r: 3, fill: '#8B4513', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* --- Second Row: Best Sellers & Latest Products --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Latest Products</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {(stats?.latestProducts ?? []).map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  {product.image ? (
                    <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm" />
                  ) : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">No Img</div>}
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{product.category_name || 'Uncategorized'}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-[#8B4513]">${Number(product.price).toFixed(2)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${product.stock > 10 ? 'bg-green-100 text-green-700' : (product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
            {(stats?.latestProducts ?? []).length === 0 && (
              <div className="p-10 text-center text-gray-400">No products available</div>
            )}
          </div>
        </div>

        {/* Best Selling Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Top Selling Items</h2>
          <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.analytics?.bestSellers || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {(stats?.analytics?.bestSellers || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Third Row: Recent Orders & Recent Customers --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Details List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm font-semibold text-[#8B4513] hover:underline">View All Orders &rarr;</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Items</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(stats?.recentOrders ?? []).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800">#{order.order_number}</td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="font-medium">{order.quantity}</span> items<br />
                      <span className="text-xs text-gray-400 block truncate max-w-[150px]" title={order.product_name}>{order.product_name}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-[#8B4513]">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${statusColors[order.order_status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(stats?.recentOrders ?? []).length === 0 && (
                  <tr><td colSpan="5" className="py-12 text-center text-gray-400">No recent orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">New Customers</h2>
          </div>
          <div className="flex-1 divide-y divide-gray-50">
            {(stats?.recentCustomers ?? []).map((customer) => (
              <div key={customer.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center text-[#8B4513] font-bold">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{customer.name}</h3>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-800">{customer.total_orders} Orders</p>
                  <p className="text-[10px] text-gray-400">{new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {(stats?.recentCustomers ?? []).length === 0 && (
              <div className="p-12 text-center text-gray-400">No new customers.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
