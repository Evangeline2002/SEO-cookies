import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import AdminTopNav from '../../components/admin/AdminTopNav';

export default function AdminLayout() {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopNav />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
