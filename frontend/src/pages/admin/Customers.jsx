import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getCustomers } from '../../services/adminService';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCustomers({ search })
      .then(({ data }) => setCustomers(data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, [search]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-400 mt-1">View your customer base</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#8B4513]/10 flex items-center justify-center text-[#8B4513] font-bold text-lg mb-3">
              {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <h3 className="font-semibold text-gray-800">{customer.name}</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineMail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{customer.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlinePhone className="w-4 h-4 flex-shrink-0" />
                <span>{customer.phone || '-'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-sm">
              <span className="text-gray-400">{customer.total_orders} orders</span>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{customer.status}</span>
            </div>
          </div>
        ))}
        {customers.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No customers found</div>}
      </div>
    </div>
  );
}
