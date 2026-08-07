import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';


export default function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isLoggedIn) {
            onClose();
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        onClose();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--color-background)] shadow-2xl z-50 flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping Cart"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-primary)]/20">
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
                                <span>🛒</span> Your Cart
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
                                aria-label="Close cart"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-[var(--color-text)]/60">
                                    <span className="text-6xl mb-4 opacity-50">🍪</span>
                                    <p className="text-lg font-medium">Your cart is empty.</p>
                                    <p className="text-sm mt-2 text-center">Looks like you haven't added any premium cookies yet!</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 btn btn-outline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-[var(--color-primary)]/20 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-20 h-20 bg-[var(--color-background)] rounded-xl flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                                            {item.img ? (
                                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                item.emoji
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-[var(--color-text)] truncate">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors shrink-0"
                                                    aria-label={`Remove ${item.name}`}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[var(--color-primary)] font-bold mb-2">₹{item.price}</p>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1.5 px-2 hover:text-[var(--color-primary)] transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FiMinus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 px-2 hover:text-[var(--color-primary)] transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FiPlus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-[var(--color-primary)]/20 bg-white space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold text-[var(--color-text)]">
                                    <span>Subtotal:</span>
                                    <span className="text-[var(--color-primary)] text-xl">₹{cartTotal}</span>
                                </div>
                                <p className="text-xs text-center text-gray-500">Shipping & taxes calculated at checkout.</p>

                                {!isLoggedIn && (
                                    <p className="text-xs text-center text-amber-600 font-semibold bg-amber-50 px-3 py-2 rounded-xl">
                                        ⚠️ Please login first to place your order
                                    </p>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn btn-primary flex justify-center items-center gap-2 py-4 text-lg"
                                >
                                    {isLoggedIn ? (
                                        <>
                                            <FiShoppingBag size={22} /> Place Order
                                        </>
                                    ) : (
                                        'Login to Checkout'
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
