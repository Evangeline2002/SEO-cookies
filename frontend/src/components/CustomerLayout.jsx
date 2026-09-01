import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';

export default function CustomerLayout() {
    const { isCartOpen, setIsCartOpen } = useCart();

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <div className="flex-grow pt-[128px]">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
