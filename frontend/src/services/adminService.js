import api from './api';

// Auth
export const loginAdmin = (data) => api.post('/auth/login', data);
export const getAdminProfile = () => api.get('/auth/profile');
export const updateAdminProfile = (data) => api.put('/auth/profile', data);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Gift Boxes
export const getGiftBoxes = () => api.get('/giftboxes');
export const getGiftBox = (id) => api.get(`/giftboxes/${id}`);
export const createGiftBox = (data) => api.post('/giftboxes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateGiftBox = (id, data) => api.put(`/giftboxes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteGiftBox = (id) => api.delete(`/giftboxes/${id}`);

// Recipes
export const getRecipes = () => api.get('/recipes');
export const getRecipe = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (data) => api.post('/recipes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);

// Orders
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Customers
export const getCustomers = (params) => api.get('/customers', { params });
export const getCustomer = (id) => api.get(`/customers/${id}`);

// Reviews
export const getReviews = (params) => api.get('/reviews', { params });
export const updateReviewStatus = (id, status) => api.put(`/reviews/${id}/status`, { status });
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

// SEO
export const getSEOSettings = () => api.get('/seo');
export const updateSEOSetting = (id, data) => api.put(`/seo/${id}`, data);

// Settings
export const getWebsiteSettings = () => api.get('/settings');
export const updateWebsiteSettings = (data) => api.put('/settings', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// WhatsApp
export const getWhatsAppLogs = () => api.get('/whatsapp/logs');
export const sendWhatsApp = (orderId) => api.post(`/whatsapp/send/${orderId}`);
export const resendWhatsApp = (id) => api.post(`/whatsapp/resend/${id}`);
