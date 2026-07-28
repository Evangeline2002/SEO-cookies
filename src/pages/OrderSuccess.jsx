import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiFileText, FiHash, FiCheckCircle, FiArrowRight, FiEye } from 'react-icons/fi';
import SEO from '../components/SEO';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = useRef(location.state || {}).current;

  useEffect(() => {
    if (!orderData.orderId) {
      navigate('/shop', { replace: true });
    }
  }, [orderData.orderId, navigate]);

  if (!orderData.orderId) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const downloadUrl = orderData.pdfPath ? `http://localhost:5000${orderData.pdfPath}` : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-16" style={{ backgroundColor: '#FFF8F2' }}>
      <SEO title="Order Placed | Cookie Heaven" description="Your Cookie Heaven order has been placed successfully!" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl border p-8 md:p-10 text-center"
        style={{ borderColor: 'rgba(139,69,19,0.08)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#E8F5E9' }}
        >
          <FiCheckCircle className="text-green-600 w-10 h-10" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#5C2D0A' }}>
          🎉 Thank You for Your Order!
        </h1>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          Your order has been placed successfully.
        </p>

        <div className="rounded-2xl p-5 mb-6 text-left space-y-4" style={{ backgroundColor: '#FFF8F2' }}>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }}>
              <FiHash className="text-amber-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Order ID</p>
              <p className="font-bold text-base" style={{ color: '#2D2D2D' }}>{orderData.orderId}</p>
            </div>
          </div>

          {orderData.invoiceNumber && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E1F5FE' }}>
                <FiFileText className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Invoice Number</p>
                <p className="font-bold text-base" style={{ color: '#2D2D2D' }}>{orderData.invoiceNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F5E9' }}>
              <FiCheckCircle className="text-green-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <p className="font-bold text-base text-green-700">Payment Successful</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 text-blue-800 text-xs text-left p-4 rounded-xl mb-8 space-y-2 border border-blue-100">
          <p>📧 A copy of your invoice has been sent to your registered email address.</p>
        </div>

        <div className="space-y-3">
          {downloadUrl && (
            <motion.a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2.5 transition-all"
              style={{
                background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                boxShadow: '0 8px 24px rgba(139,69,19,0.35)'
              }}
            >
              <FiFileText size={18} />
              Download Invoice (PDF)
            </motion.a>
          )}

          <div className="grid grid-cols-2 gap-3 mt-3">
            {downloadUrl && (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const printWindow = window.open(downloadUrl, '_blank');
                  printWindow.onload = () => printWindow.print();
                }}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border-2 border-gray-100 hover:border-gray-200"
                style={{ color: '#4B5563' }}
              >
                <FiFileText size={16} />
                Print Invoice
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/shop')}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ color: '#8B4513', backgroundColor: '#FFF8F2' }}
            >
              <FiShoppingBag size={16} />
              Continue Shopping
            </motion.button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
