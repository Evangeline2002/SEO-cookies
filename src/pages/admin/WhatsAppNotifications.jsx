import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineEye, HiOutlineDownload, HiOutlinePaperAirplane, HiOutlineRefresh } from 'react-icons/hi';
import { toast } from 'react-toastify';
import api from '../../services/api';

const statusStyles = {
    Sent: 'bg-green-100 text-green-700',
    Delivered: 'bg-blue-100 text-blue-700',
    Failed: 'bg-red-100 text-red-700',
    Pending: 'bg-amber-100 text-amber-700'
};

export default function WhatsAppNotifications() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sendingIds, setSendingIds] = useState(new Set());
    const navigate = useNavigate();

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/whatsapp/logs');
            setLogs(data);
        } catch (err) {
            toast.error('Failed to load WhatsApp logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSend = async (orderId) => {
        setSendingIds(prev => new Set(prev).add(orderId));
        try {
            await api.post(`/whatsapp/send/${orderId}`);
            toast.success('WhatsApp message sent!');
            fetchLogs();
        } catch {
            toast.error('Failed to send WhatsApp message');
        } finally {
            setSendingIds(prev => { const next = new Set(prev); next.delete(orderId); return next; });
        }
    };

    const handleResend = async (id) => {
        setSendingIds(prev => new Set(prev).add(`resend-${id}`));
        try {
            await api.post(`/whatsapp/resend/${id}`);
            toast.success('WhatsApp message resent!');
            fetchLogs();
        } catch {
            toast.error('Failed to resend WhatsApp message');
        } finally {
            setSendingIds(prev => { const next = new Set(prev); next.delete(`resend-${id}`); return next; });
        }
    };

    const filteredLogs = logs.filter(log => {
        const s = search.toLowerCase();
        return (
            (log.invoice_number && log.invoice_number.toLowerCase().includes(s)) ||
            log.customer_name.toLowerCase().includes(s) ||
            log.phone_number.includes(s) ||
            (log.order_id && String(log.order_id).includes(s))
        );
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">WhatsApp Notifications</h1>
                <p className="text-gray-400 mt-1">Monitor and manage automated WhatsApp invoice deliveries.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <div className="relative w-full max-w-md">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Order ID, Name, Phone, Invoice..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none bg-white transition-all text-sm"
                    />
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
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Invoice Number</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Customer Name</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">WhatsApp Number</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Message Status</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Sent Date</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Delivered Date</th>
                                    <th className="text-right px-5 py-4 font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => {
                                    const isSending = sendingIds.has(log.order_id);
                                    const isResending = sendingIds.has(`resend-${log.id}`);
                                    const invoiceUrl = log.invoice_url || '#';
                                    return (
                                        <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                                            <td className="px-5 py-4 font-medium text-gray-800">
                                                {log.order_id ? `#${log.order_id}` : '-'}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-[#8B4513]">
                                                {log.invoice_number || '-'}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-gray-800">{log.customer_name}</td>
                                            <td className="px-5 py-4 text-gray-600">{log.phone_number}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold tracking-wider ${statusStyles[log.message_status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {log.message_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 text-xs">
                                                {log.sent_at ? new Date(log.sent_at).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 text-xs">
                                                {log.delivered_at ? new Date(log.delivered_at).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/invoices`)}
                                                        title="View Invoice"
                                                        className="p-2 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
                                                    >
                                                        <HiOutlineEye className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={invoiceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Download Invoice"
                                                        className="p-2 rounded-lg bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                                    >
                                                        <HiOutlineDownload className="w-4 h-4" />
                                                    </a>
                                                    {!log.sent_at && (
                                                        <button
                                                            onClick={() => handleSend(log.order_id)}
                                                            disabled={isSending || !log.order_id}
                                                            title="Send WhatsApp"
                                                            className="p-2 rounded-lg bg-gray-100 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                        >
                                                            {isSending ? (
                                                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <HiOutlinePaperAirplane className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                    {log.sent_at && (
                                                        <button
                                                            onClick={() => handleResend(log.id)}
                                                            disabled={isResending}
                                                            title="Resend WhatsApp"
                                                            className="p-2 rounded-lg bg-gray-100 text-amber-600 hover:bg-amber-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                        >
                                                            {isResending ? (
                                                                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <HiOutlineRefresh className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredLogs.length === 0 && (
                                    <tr><td colSpan="8" className="px-6 py-16 text-center text-gray-400 font-medium">No WhatsApp notifications found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
