// ============================================================
// productData.js – Mock cookie product catalogue
// ============================================================

export const CATEGORIES = [
    'All', 'Chocolate', 'Butter', 'Oatmeal', 'Peanut Butter',
    'Sugar', 'Red Velvet', 'Brownie', 'Nut', 'Healthy', 'Vegan', 'Gluten-Free',
];

export const SHOP_CATEGORIES = [
    { id: 'all', label: 'All Cookies', icon: '🍪' },
    { id: 'combo', label: 'Combo Packs', icon: '📦' },
    { id: 'family', label: 'Family Packs', icon: '👨‍👩‍👧‍👦' },
    { id: 'premium', label: 'Premium Collection', icon: '✨' },
    { id: 'seasonal', label: 'Seasonal Specials', icon: '🎄' },
    { id: 'corporate', label: 'Corporate Gifts', icon: '💼' },
    { id: 'party', label: 'Party Packs', icon: '🎉' },
];

export const GIFT_BOX_CATEGORIES = [
    { id: 'birthday', label: 'Birthday Gift Boxes', icon: '🎂' },
    { id: 'festival', label: 'Festival Gift Boxes', icon: '🎁' },
    { id: 'wedding', label: 'Wedding Gift Boxes', icon: '💍' },
    { id: 'corporate', label: 'Corporate Gift Boxes', icon: '💼' },
    { id: 'custom', label: 'Custom Gift Boxes', icon: '🎨' },
];

import imgDoubleChoc from '../assets/double_chocolate_chip_cookies-3-1.jpg';
import imgButter from '../assets/butter cookies.jpg';
import imgOatsHoney from '../assets/oats honey cookies.jpg';
import imgRedVelvet from '../assets/red velvet cookies.jpg';
import imgFudgeBrownie from '../assets/fudy_browine_cookies.jpg';
import imgMixedNuts from '../assets/mixed_nuts_cookies.jpg';
import imgOatmealRaisin from '../assets/oatmeal raisin cookies.jpg';
import imgPeanutButter from '../assets/peanut_butter_cookies.jpg';
import imgSparkleSugar from '../assets/sparkle_sugar.jpg';
import imgVeganChoco from '../assets/vagan_choco_chip_cookies.jpg';
import imgGlutenFree from '../assets/gluten_free_almond_cookies.jpg';
import imgChocoClassic from '../assets/Chocolate_Chip_Classic_Cookie.jpg';

export const products = [
    { id: 1, name: 'Double Chocolate Brownie Cookie', category: 'Chocolate', price: 249, originalPrice: 299, badge: 'hot', rating: 4.9, reviews: 312, weight: '150g', emoji: '🍫', img: imgDoubleChoc, bestseller: true },
    { id: 2, name: 'Classic Butter Cookie', category: 'Butter', price: 199, originalPrice: null, badge: null, rating: 4.7, reviews: 218, weight: '200g', emoji: '🍪', img: imgButter, bestseller: true },
    { id: 3, name: 'Oatmeal Raisin Cookie', category: 'Oatmeal', price: 179, originalPrice: 210, badge: 'sale', rating: 4.5, reviews: 145, weight: '180g', emoji: '🌾', img: imgOatmealRaisin, bestseller: false },
    { id: 4, name: 'Peanut Butter Crunch Cookie', category: 'Peanut Butter', price: 229, originalPrice: null, badge: 'new', rating: 4.8, reviews: 89, weight: '160g', emoji: '🥜', img: imgPeanutButter, bestseller: false },
    { id: 5, name: 'Sparkle Sugar Cookie', category: 'Sugar', price: 159, originalPrice: null, badge: null, rating: 4.4, reviews: 176, weight: '200g', emoji: '⭐', img: imgSparkleSugar, bestseller: false },
    { id: 6, name: 'Red Velvet Dream Cookie', category: 'Red Velvet', price: 269, originalPrice: 320, badge: 'hot', rating: 4.9, reviews: 267, weight: '150g', emoji: '❤️', img: imgRedVelvet, bestseller: true },
    { id: 7, name: 'Fudge Brownie Cookie', category: 'Brownie', price: 239, originalPrice: null, badge: 'new', rating: 4.8, reviews: 134, weight: '160g', emoji: '🍮', img: imgFudgeBrownie, bestseller: false },
    { id: 8, name: 'Mixed Nut Cookie', category: 'Nut', price: 299, originalPrice: 349, badge: null, rating: 4.6, reviews: 98, weight: '170g', emoji: '🌰', img: imgMixedNuts, bestseller: false },
    { id: 9, name: 'Oat & Honey Health Cookie', category: 'Healthy', price: 219, originalPrice: null, badge: 'veg', rating: 4.7, reviews: 203, weight: '180g', emoji: '🍯', img: imgOatsHoney, bestseller: true },
    { id: 10, name: 'Vegan Choco Chip Cookie', category: 'Vegan', price: 249, originalPrice: null, badge: 'new', rating: 4.8, reviews: 156, weight: '150g', emoji: '🌱', img: imgVeganChoco, bestseller: false },
    { id: 11, name: 'Gluten-Free Almond Cookie', category: 'Gluten-Free', price: 279, originalPrice: 320, badge: null, rating: 4.7, reviews: 112, weight: '160g', emoji: '🌾', img: imgGlutenFree, bestseller: false },
    { id: 12, name: 'Chocolate Chip Classic Cookie', category: 'Chocolate', price: 189, originalPrice: 219, badge: 'hot', rating: 4.9, reviews: 421, weight: '200g', emoji: '🍪', img: imgChocoClassic, bestseller: true },
];

export const giftBoxes = [
    { id: 'g1', name: 'Birthday Celebration Box', price: 599, pieces: 12, icon: '🎂', badge: 'new' },
    { id: 'g2', name: 'Diwali Festival Box', price: 799, pieces: 16, icon: '🪔', badge: 'hot' },
    { id: 'g3', name: 'Wedding Sweet Box', price: 999, pieces: 24, icon: '💍', badge: null },
    { id: 'g4', name: 'Corporate Assorted Box', price: 1199, pieces: 30, icon: '💼', badge: null },
    { id: 'g5', name: 'Custom Personalised Box', price: 699, pieces: 20, icon: '🎨', badge: 'new' },
];

export const bestSellers = products.filter(p => p.bestseller);
export const newArrivals = products.filter(p => p.badge === 'new');
