import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import { websiteSchema, orgSchema } from './utils/structuredData';
import CustomerLayout from './components/CustomerLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import CookieMenu from './pages/CookieMenu';
import GiftBoxes from './pages/GiftBoxes';
import Recipes from './pages/Recipes';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminRecipes from './pages/admin/Recipes';
import AdminGiftBoxes from './pages/admin/GiftBoxes';
import AdminReviews from './pages/admin/Reviews';
import AdminSettings from './pages/admin/Settings';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSEOSettings from './pages/admin/SEOSettings';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <SEO schema={[websiteSchema, orgSchema]} />
      <ScrollToTop />

      <Routes>
        {/* Customer Routes with Header/Footer */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="blog" element={<Blog />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="place-order" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="cookies" element={<CookieMenu />} />
          <Route path="gift-boxes" element={<GiftBoxes />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes — completely separate from customer layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="recipes" element={<AdminRecipes />} />
          <Route path="gift-boxes" element={<AdminGiftBoxes />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="seo" element={<AdminSEOSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="website-settings" element={<AdminSettings />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
