import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineDocumentText, HiOutlinePrinter, HiOutlineDownload, HiOutlineTrash, HiOutlineMail, HiOutlineEye, HiX } from 'react-icons/hi';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewInvoice, setViewInvoice] = useState(null);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/invoices');
            setInvoices(data);
        } catch (err) {
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice and its associated file?')) return;
        try {
            await api.delete(`/invoices/${id}`);
            toast.success('Invoice deleted successfully');
            setInvoices(invoices.filter(i => i.id !== id));
        } catch {
            toast.error('Failed to delete invoice');
        }
    };

    const handleResend = async (id) => {
        try {
            await api.post(`/invoices/${id}/resend`);
            toast.success('Invoice queued for resending!');
        } catch {
            toast.error('Failed to resend invoice');
        }
    };

    const handleView = async (id) => {
        try {
            const { data } = await api.get(`/invoices/${id}`);
            setViewInvoice(data);
        } catch {
            toast.error('Failed to fetch invoice details');
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const s = search.toLowerCase();
        return (
            inv.invoice_number.toLowerCase().includes(s) ||
            inv.customer_name.toLowerCase().includes(s) ||
            (inv.email && inv.email.toLowerCase().includes(s)) ||
            (inv.phone && inv.phone.toLowerCase().includes(s))
        );
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Invoice Management</h1>
                <p className="text-gray-400 mt-1">View, track, and manage automatically generated order invoices.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <div className="relative w-full max-w-md">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Invoice No, Name, Email, Phone..."
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
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Invoice Number</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Order ID</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Customer Name</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Email</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Phone</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Total Amount</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Payment Status</th>
                                    <th className="text-left px-5 py-4 font-semibold text-gray-500">Invoice Date</th>
                                    <th className="text-right px-5 py-4 font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((inv) => {
                                    const pdfUrl = inv.pdf_path ? `http://localhost:5000${inv.pdf_path}` : '#';
                                    return (
                                        <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                                            <td className="px-5 py-4 font-bold text-[#8B4513] flex items-center gap-2">
                                                <HiOutlineDocumentText className="w-4 h-4" />
                                                {inv.invoice_number}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-gray-800">Order #{inv.order_id}</td>
                                            <td className="px-5 py-4 font-medium text-gray-800">{inv.customer_name}</td>
                                            <td className="px-5 py-4 text-gray-600">{inv.email || '-'}</td>
                                            <td className="px-5 py-4 text-gray-600">{inv.phone || '-'}</td>
                                            <td className="px-5 py-4 font-bold text-gray-800">₹{Number(inv.grand_total || inv.total_amount).toFixed(2)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold tracking-wider ${inv.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {inv.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 text-xs">{new Date(inv.created_at).toLocaleDateString()}</td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleView(inv.id)} title="View Invoice Details" className="p-2 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200">
                                                        <HiOutlineEye className="w-4 h-4" />
                                                    </button>
                                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" title="View/Print PDF" className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#8B4513] hover:text-white transition-colors duration-200">
                                                        <HiOutlinePrinter className="w-4 h-4" />
                                                    </a>
                                                    <a href={pdfUrl} download title="Download PDF" className="p-2 rounded-lg bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200">
                                                        <HiOutlineDownload className="w-4 h-4" />
                                                    </a>
                                                    <button onClick={() => handleResend(inv.id)} title="Resend by Email" className="p-2 rounded-lg bg-gray-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200">
                                                        <HiOutlineMail className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(inv.id)} title="Delete Invoice" className="p-2 rounded-lg bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200">
                                                        <HiOutlineTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredInvoices.length === 0 && (
                                    <tr><td colSpan="9" className="px-6 py-16 text-center text-gray-400 font-medium">No invoices found matching your criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View Invoice Modal */}
            {viewInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-[#8B4513]">Invoice Details</h2>
                            <button onClick={() => setViewInvoice(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Invoice Number</p>
                                    <p className="font-bold text-gray-800">{viewInvoice.invoice_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Order ID</p>
                                    <p className="font-bold text-gray-800">Order #{viewInvoice.order_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Invoice Date</p>
                                    <p className="font-bold text-gray-800">{new Date(viewInvoice.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Payment Method</p>
                                    <p className="font-bold text-gray-800">{viewInvoice.payment_method}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Customer Details</h3>
                                <p className="font-semibold text-gray-800">{viewInvoice.customer_name}</p>
                                <p className="text-gray-600 text-sm">{viewInvoice.email || 'N/A'}</p>
                                <p className="text-gray-600 text-sm">{viewInvoice.phone || 'N/A'}</p>
                            </div>

                            {viewInvoice.items && viewInvoice.items.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Order Items</h3>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-500 mb-2">
                                                <th className="py-2">Item</th>
                                                <th className="py-2">Qty</th>
                                                <th className="py-2 text-right">Price</th>
                                                <th className="py-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewInvoice.items.map((item, idx) => (
                                                <tr key={idx} className="border-t border-gray-100">
                                                    <td className="py-2 text-gray-800">{item.product_name}</td>
                                                    <td className="py-2 text-gray-600">{item.quantity}</td>
                                                    <td className="py-2 text-right text-gray-600">₹{Number(item.price).toFixed(2)}</td>
                                                    <td className="py-2 text-right font-medium text-gray-800">₹{Number(item.subtotal || (item.price * item.quantity)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-t-2 border-gray-200 mt-2">
                                            <tr>
                                                <td colSpan="3" className="py-2 text-right font-semibold text-gray-600">Subtotal</td>
                                                <td className="py-2 text-right font-bold text-gray-800">₹{Number(viewInvoice.subtotal || viewInvoice.total_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="py-1 text-right text-gray-500">Delivery Charge</td>
                                                <td className="py-1 text-right text-gray-600">₹{Number(viewInvoice.delivery_charge || 0).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="py-1 text-right text-gray-500">Tax</td>
                                                <td className="py-1 text-right text-gray-600">₹{Number(viewInvoice.tax || 0).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="py-2 text-right font-bold text-[#8B4513] text-lg">Grand Total</td>
                                                <td className="py-2 text-right font-bold text-[#8B4513] text-lg">₹{Number(viewInvoice.grand_total || viewInvoice.total_amount).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
