import { Product, PromoCoupon, BookingOrder } from '../types';
import { DUMMY_PRODUCTS } from '../data/products';
import { PROMO_COUPONS } from '../data/promotions';

const API_BASE = '/api';
const authHeaders = () => {
  const token = localStorage.getItem('soundrent_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const soundRentApi = {
  /**
   * Fetch all products from Cloudflare D1
   */
  async getProducts(): Promise<{ products: Product[]; isFromBackend: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Cache to localStorage for offline / instant reload
        localStorage.setItem('soundrent_products', JSON.stringify(data));
        return { products: data, isFromBackend: true };
      }
    } catch (err) {
      console.warn('Backend API /api/products unavailable or empty, falling back to local storage/seed:', err);
    }

    const saved = localStorage.getItem('soundrent_products');
    return {
      products: saved ? JSON.parse(saved) : DUMMY_PRODUCTS,
      isFromBackend: false,
    };
  },

  /**
   * Create a new product in Cloudflare D1
   */
  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to call POST /api/products, falling back to client generation:', err);
    }

    // Fallback client-side creation
    const newProduct: Product = {
      id: product.id || `prod-${Date.now()}`,
      name: product.name || 'Produk Baru',
      brand: product.brand || 'Custom',
      category: product.category || 'DJ Gear',
      dailyPrice: product.dailyPrice || 100000,
      stock: product.stock !== undefined ? product.stock : 1,
      image: product.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      description: product.description || '',
      features: product.features || [],
      specs: product.specs || {},
      isPromo: product.isPromo || false,
      promoDiscountPercent: product.promoDiscountPercent || 0,
      promoTag: product.promoTag,
      depositAmount: product.depositAmount || 0,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0,
      includedAccessories: product.includedAccessories || [],
    };
    return newProduct;
  },

  /**
   * Update product in Cloudflare D1
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`Failed to call PUT /api/products/${id}:`, err);
    }
    return null;
  },

  /**
   * Delete product in Cloudflare D1
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.warn(`Failed to call DELETE /api/products/${id}:`, err);
      return false;
    }
  },

  /**
   * Get active promotions
   */
  async getPromotions(): Promise<PromoCoupon[]> {
    try {
      const res = await fetch(`${API_BASE}/promotions`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Promotions API unavailable, fallback to default:', err);
    }
    return PROMO_COUPONS;
  },

  /**
   * Save customer order to Cloudflare D1
   */
  async submitOrder(order: BookingOrder): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(order),
      });
      return res.ok;
    } catch (err) {
      console.warn('Failed to persist order to Cloudflare D1:', err);
      return false;
    }
  },

  /**
   * Fetch all orders from Cloudflare D1
   */
  async getOrders(): Promise<BookingOrder[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Orders API unavailable:', err);
    }
    return [];
  }
};
