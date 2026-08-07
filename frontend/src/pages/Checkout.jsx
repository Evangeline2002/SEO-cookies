import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiCheck, FiArrowLeft, FiMinus, FiPlus, FiTrash2, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const STORE_WHATSAPP = '919876543210';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Checkout() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: ''
    }
  });

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (cart.length === 0) navigate('/shop');
  }, [cart, isLoggedIn, navigate]);

  const shipping = cartTotal > 0 ? (cartTotal >= 499 ? 0 : 49) : 0;
  const totalAmount = cartTotal + shipping;

  const onSubmit = async (data) => {
    if (!paymentMethod) {
      toast.error('Please select a payment method', {
        style: { borderRadius: '16px' }
      });
      return;
    }

    try {
      // 1. Save to Database FIRST
      const orderPayload = {
        customer_name: data.name,
        email: user?.email || '',
        phone: data.phone,
        address: data.address,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        subtotal: cartTotal,
        delivery_charge: shipping,
        discount: 0,
        tax: 0,
        grand_total: totalAmount,
        items: cart
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Failed to save order to database');
      }

      const responseData = await res.json();
      const orderId = responseData.order_number;
      const invoiceNumber = responseData.invoice_number;
      const pdfPath = responseData.pdf_path;

      // 2. Build WhatsApp String
      const lines = [
        `🍪 *COOKIE HEAVEN — Order Confirmation*`,
        `────────────────────────`,
        `🆔 *Order ID:* ${orderId}`,
        `📄 *Invoice No:* ${invoiceNumber}`,
        `👤 *Name:* ${data.name}`,
        `📱 *Phone:* ${data.phone}`,
        `🏠 *Address:* ${data.address}`,
        `💳 *Payment:* ${paymentMethod}`,
        `────────────────────────`,
        ``,
        `*Order Items:*`
      ];

      cart.forEach((item, i) => {
        lines.push(`${i + 1}. ${item.name}`);
        lines.push(`   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`);
      });

      lines.push(``);
      lines.push(`────────────────────────`);
      lines.push(`🚚 *Delivery:* ${shipping === 0 ? 'Free' : '₹' + shipping}`);
      lines.push(`💰 *Total: ₹${totalAmount}*`);
      lines.push(``);
      lines.push(`Please confirm my order. Thank you! 🙏`);

      const message = lines.join('\n');
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${STORE_WHATSAPP}?text=${encoded}`;

      // 3. Open WhatsApp in new tab
      window.open(url, '_blank');

      toast.success(
        <div>
          <div className="font-semibold text-gray-900 text-base">🎉 Order Placed Successfully!</div>
          <div className="text-sm text-gray-500 mt-1">
            Thank you for your order. Your freshly baked cookies are now being prepared.
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
            Estimated Delivery: <span className="font-medium text-gray-600">30–45 Minutes</span>
            <br />
            Order ID: <span className="font-medium text-gray-600">{orderId}</span>
          </div>
        </div>,
        {
          autoClose: 5000,
          style: { borderRadius: '16px', padding: '16px 20px', width: '360px' }
        }
      );

      clearCart();

      setTimeout(() => {
        navigate('/order-success', { state: { orderId, invoiceNumber, pdfPath, totalAmount, paymentMethod, name: data.name } });
      }, 1500);

    } catch (err) {
      toast.error('Error placing order. Please try again.');
      console.error(err);
    }
  };

  if (!isLoggedIn || cart.length === 0) return null;

  const paymentOptions = [
    { id: 'Cash on Delivery', icon: <FiDollarSign size={22} />, desc: 'Pay when your order arrives' },
    { id: 'UPI Payment', icon: <FiSmartphone size={22} />, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'Card Payment', icon: <FiCreditCard size={22} />, desc: 'Credit or Debit Card' }
  ];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: '#FFF8F2' }}>
      <SEO title="Place Order | Cookie Heaven" description="Complete your Cookie Heaven order and get freshly baked cookies delivered to your doorstep." />

      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#8B4513] font-medium transition-colors text-sm"
        >
          <FiArrowLeft size={16} /> Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#5C2D0A' }}>
            Place Your Order
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            You're just a few steps away from freshly baked cookie heaven
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Left Column: Customer Details & Payment */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Details */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border" style={{ borderColor: 'rgba(139,69,19,0.08)' }}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#5C2D0A' }}>
                <FiUser size={20} style={{ color: '#8B4513' }} />
                Customer Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-1.5" style={{ color: '#4A4A4A' }}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#8B4513] bg-gray-50 focus:bg-white'}`}
                    style={{ color: '#2D2D2D' }}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-1.5" style={{ color: '#4A4A4A' }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone', { required: 'Phone is required', minLength: { value: 10, message: 'Enter valid phone number' } })}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-all text-sm ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#8B4513] bg-gray-50 focus:bg-white'}`}
                      style={{ color: '#2D2D2D' }}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold mb-1.5" style={{ color: '#4A4A4A' }}>
                    Delivery Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 text-gray-400" size={16} />
                    <textarea
                      id="address"
                      rows="3"
                      {...register('address', { required: 'Address is required' })}
                      placeholder="Enter your full delivery address..."
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-all text-sm resize-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#8B4513] bg-gray-50 focus:bg-white'}`}
                      style={{ color: '#2D2D2D' }}
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</p>}
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border" style={{ borderColor: 'rgba(139,69,19,0.08)' }}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#5C2D0A' }}>
                <FiDollarSign size={20} style={{ color: '#8B4513' }} />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <motion.label
                    key={option.id}
                    whileHover={{ scale: 1.005 }}
                    className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === option.id
                      ? 'border-[#8B4513] bg-[#8B4513]/5'
                      : 'border-gray-100 hover:border-[#8B4513]/30 hover:bg-gray-50'
                      }`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-all ${paymentMethod === option.id ? 'border-[#8B4513] bg-[#8B4513]' : 'border-gray-300'
                      }`}>
                      {paymentMethod === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <FiCheck className="text-white" size={14} />
                        </motion.div>
                      )}
                    </div>
                    <div className="mr-4" style={{ color: '#8B4513' }}>{option.icon}</div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2D2D2D' }}>{option.id}</div>
                      <div className="text-xs text-gray-400">{option.desc}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border sticky top-24" style={{ borderColor: 'rgba(139,69,19,0.08)' }}>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: '#5C2D0A' }}>
                <span>🛒</span>
                Your Cart
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mb-5 no-scrollbar">
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ backgroundColor: '#FFF8F2' }}
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm overflow-hidden flex-shrink-0 border border-gray-100">
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.emoji || '🍪'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: '#2D2D2D' }}>{item.name}</p>
                        <p className="text-xs font-medium" style={{ color: '#8B4513' }}>₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                          style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </motion.button>
                        <span className="w-6 text-center text-sm font-semibold" style={{ color: '#2D2D2D' }}>
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                          style={{ backgroundColor: '#F3F4F6', color: '#8B4513' }}
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </motion.button>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="font-bold text-sm" style={{ color: '#5C2D0A' }}>₹{item.price * item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2.5" style={{ borderColor: '#F3F4F6' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold" style={{ color: '#2D2D2D' }}>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t" style={{ borderColor: '#F3F4F6', color: '#5C2D0A' }}>
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                onClick={handleSubmit(onSubmit)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2.5 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                  boxShadow: '0 8px 24px rgba(139,69,19,0.35)'
                }}
              >
                <FaWhatsapp size={20} />
                Place Order
              </motion.button>
              <p className="text-center text-xs text-gray-400 mt-3">
                You'll receive order confirmation via WhatsApp
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
