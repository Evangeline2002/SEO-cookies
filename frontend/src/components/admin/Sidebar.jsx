import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineViewGrid, HiOutlineShoppingBag, HiOutlineTag,
  HiOutlineClipboardList, HiOutlineUsers, HiOutlineBookOpen,
  HiOutlineGift, HiOutlineStar, HiOutlineLogout,
  HiOutlineMenuAlt2, HiOutlineX, HiOutlineCake,
  HiOutlineChartBar, HiOutlineSearchCircle, HiOutlineGlobe, HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineChatAlt2
} from 'react-icons/hi';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/admin/products', label: 'Products', icon: HiOutlineShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: HiOutlineTag },
  { to: '/admin/gift-boxes', label: 'Gift Boxes', icon: HiOutlineGift },
  { to: '/admin/recipes', label: 'Recipes', icon: HiOutlineBookOpen },
  { to: '/admin/orders', label: 'Orders', icon: HiOutlineClipboardList },
  { to: '/admin/invoices', label: 'Invoices', icon: HiOutlineDocumentText },
  { to: '/admin/whatsapp', label: 'WhatsApp', icon: HiOutlineChatAlt2 },
  { to: '/admin/customers', label: 'Customers', icon: HiOutlineUsers },
  { to: '/admin/reviews', label: 'Reviews', icon: HiOutlineStar },
  { to: '/admin/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/admin/seo', label: 'SEO Settings', icon: HiOutlineSearchCircle },
  { to: '/admin/website-settings', label: 'Website Settings', icon: HiOutlineGlobe },
  { to: '/admin/profile', label: 'Admin Profile', icon: HiOutlineUser },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${isActive
      ? 'bg-[#8B4513] text-white shadow-lg shadow-[#8B4513]/30'
      : 'text-gray-600 hover:bg-[#8B4513]/10 hover:text-[#8B4513]'
    }`;

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#8B4513] flex items-center justify-center text-white text-xl">
          <HiOutlineCake />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-lg leading-tight">Cookie Heaven</h2>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2.5 rounded-xl shadow-md border border-gray-100 text-gray-600 hover:text-[#8B4513] transition-colors"
      >
        {isOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenuAlt2 className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100 shadow-xl shadow-gray-200/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
