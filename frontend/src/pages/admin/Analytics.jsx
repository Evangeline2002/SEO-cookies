import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineUsers, HiOutlineCurrencyDollar } from 'react-icons/hi';

const COLORS = ['#8B4513', '#D2691E', '#F59E0B', '#6e350d', '#A0522D'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  const summaryCards = [
    { label: 'Total Sales', value: `$${Number(data?.totalRevenue || 0).toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: 'text-green-600' },
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: HiOutlineClipboardList, color: 'text-blue-600' },
    { label: 'Customers', value: data?.totalCustomers || 0, icon: HiOutlineUsers, color: 'text-purple-600' },
    { label: 'Products', value: data?.totalProducts || 0, icon: HiOutlineShoppingBag, color: 'text-[#8B4513]' },
  ];

  const monthlyData = (data?.monthlyOrders || []).map(m => ({
    month: m.month,
    orders: m.count,
    revenue: Number(m.revenue),
  }));

  const bestSellerData = (data?.bestSellers || []).map(b => ({
    name: b.product_name?.length > 20 ? b.product_name.slice(0, 20) + '...' : b.product_name || 'Unknown',
    quantity: b.total_qty,
    revenue: Number(b.total_revenue),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-400 mt-1">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Orders Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Orders</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#8B4513" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Revenue</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#D2691E" strokeWidth={2} dot={{ fill: '#D2691E' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Best Selling Products</h3>
        {bestSellerData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={bestSellerData} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {bestSellerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {bestSellerData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS[i % COLORS.length] }}>{i + 1}</div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">${Number(item.revenue).toFixed(2)} revenue</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">{item.quantity} sold</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
        )}
      </div>
    </div>
  );
}
