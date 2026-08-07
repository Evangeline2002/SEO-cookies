import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineBell, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function AdminTopNav() {
    const [adminName, setAdminName] = useState('Admin');
    const navigate = useNavigate();

    useEffect(() => {
        const adminUserStr = localStorage.getItem('adminUser');
        if (adminUserStr) {
            try {
                const user = JSON.parse(adminUserStr);
                setAdminName(user.name || 'Admin');
            } catch (e) {
                // ignore
            }
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            toast.success('Logged out successfully');
            navigate('/admin');
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4">
            {/* Mobile Title (sidebar handles desktop) */}
            <div className="lg:hidden">
                <h2 className="text-[#8B4513] font-bold text-xl">Dashboard</h2>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block w-full max-w-md ml-4">
                <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search across board..."
                        className="w-full bg-gray-50 border border-transparent focus:border-[#8B4513] focus:bg-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 ml-auto">
                <button className="relative p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors hidden sm:block">
                    <HiOutlineBell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

                <div className="flex items-center gap-2 pl-2">
                    <div className="w-9 h-9 rounded-full bg-[#8B4513]/10 flex items-center justify-center text-[#8B4513] font-bold shrink-0">
                        {adminName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-semibold text-gray-800 leading-none mb-0.5">{adminName}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="ml-2 p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                    <HiOutlineLogout className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
