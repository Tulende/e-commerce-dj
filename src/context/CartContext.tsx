import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartRentalItem, PromoCoupon, BookingOrder, PaymentMethodType, CustomerDetails } from '../types';
import { DUMMY_PRODUCTS } from '../data/products';
import { PROMO_COUPONS } from '../data/promotions';
import { calculateDaysBetween, getTomorrowDateString, getDayAfterTomorrowDateString } from '../utils/formatters';

interface CartContextType {
  products: Product[];
  cartItems: CartRentalItem[];
  addToCart: (product: Product, quantity?: number, startDate?: string, endDate?: string) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDates: (productId: string, startDate: string, endDate: string) => void;
  clearCart: () => void;
  
  appliedCoupon: PromoCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  subtotal: number;
  discountAmount: number;
  depositTotal: number;
  deliveryFee: number;
  totalAmount: number;
  totalItemCount: number;

  // UI state modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTermsOpen: boolean;
  setIsTermsOpen: (open: boolean) => void;
  
  // Checkout & Payment
  activeBooking: BookingOrder | null;
  setActiveBooking: (order: BookingOrder | null) => void;
  isPaymentSimulatorOpen: boolean;
  setIsPaymentSimulatorOpen: (open: boolean) => void;
  processBooking: (customer: CustomerDetails, paymentMethod: PaymentMethodType) => BookingOrder;
  confirmPaymentSuccess: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('soundrent_products');
    return saved ? JSON.parse(saved) : DUMMY_PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartRentalItem[]>(() => {
    const saved = localStorage.getItem('soundrent_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(() => {
    const saved = localStorage.getItem('soundrent_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingOrder | null>(null);
  const [isPaymentSimulatorOpen, setIsPaymentSimulatorOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('soundrent_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('soundrent_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('soundrent_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('soundrent_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (
    product: Product, 
    quantity: number = 1, 
    startDate?: string, 
    endDate?: string
  ): { success: boolean; message: string } => {
    const currentStock = products.find(p => p.id === product.id)?.stock ?? product.stock;
    const existingIndex = cartItems.findIndex(item => item.product.id === product.id);
    const currentInCart = existingIndex >= 0 ? cartItems[existingIndex].quantity : 0;

    if (currentInCart + quantity > currentStock) {
      return { 
        success: false, 
        message: `Stok tidak mencukupi. Tersedia sisa ${currentStock} unit, Anda sudah memasukkan ${currentInCart} unit di keranjang.` 
      };
    }

    const validStart = startDate || getTomorrowDateString();
    const validEnd = endDate || getDayAfterTomorrowDateString(validStart);
    const rentalDays = calculateDaysBetween(validStart, validEnd);
    
    // Hitung effective price jika ada promo bawaan produk
    const effectivePrice = product.isPromo && product.promoDiscountPercent
      ? Math.round(product.dailyPrice * (1 - product.promoDiscountPercent / 100))
      : product.dailyPrice;

    const itemSubtotal = effectivePrice * quantity * rentalDays;

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        startDate: validStart,
        endDate: validEnd,
        rentalDays,
        itemSubtotal: effectivePrice * newQty * rentalDays
      };
      setCartItems(updated);
    } else {
      setCartItems(prev => [
        ...prev,
        {
          product,
          quantity,
          startDate: validStart,
          endDate: validEnd,
          rentalDays,
          itemSubtotal
        }
      ]);
    }

    return { 
      success: true, 
      message: `${product.name} (${quantity} unit, ${rentalDays} hari sewa) berhasil ditambahkan ke keranjang!` 
    };
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const currentStock = products.find(p => p.id === productId)?.stock || 1;
    if (quantity > currentStock) return;

    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const effectivePrice = item.product.isPromo && item.product.promoDiscountPercent
          ? Math.round(item.product.dailyPrice * (1 - item.product.promoDiscountPercent / 100))
          : item.product.dailyPrice;

        return {
          ...item,
          quantity,
          itemSubtotal: effectivePrice * quantity * item.rentalDays
        };
      }
      return item;
    }));
  };

  const updateDates = (productId: string, startDate: string, endDate: string) => {
    const days = calculateDaysBetween(startDate, endDate);
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const effectivePrice = item.product.isPromo && item.product.promoDiscountPercent
          ? Math.round(item.product.dailyPrice * (1 - item.product.promoDiscountPercent / 100))
          : item.product.dailyPrice;

        return {
          ...item,
          startDate,
          endDate,
          rentalDays: days,
          itemSubtotal: effectivePrice * item.quantity * days
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Subtotal sewa seluruh item
  const subtotal = cartItems.reduce((acc, item) => acc + item.itemSubtotal, 0);

  // Total deposit jaminan barang
  const depositTotal = cartItems.reduce((acc, item) => acc + (item.product.depositAmount * item.quantity), 0);

  // Ongkos kirim / handling logistik sewa (gratis jika > 1jt)
  const deliveryFee = subtotal > 1000000 || subtotal === 0 ? 0 : 50000;

  // Kalkulasi Diskon Kupon
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount + depositTotal + deliveryFee);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = PROMO_COUPONS.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Kode kupon promo tidak valid.' };
    }
    if (subtotal < found.minSpend) {
      return { 
        success: false, 
        message: `Minimal sewa untuk kode ${cleanCode} adalah Rp ${found.minSpend.toLocaleString('id-ID')}` 
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Voucher promo ${cleanCode} berhasil digunakan!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const processBooking = (customer: CustomerDetails, paymentMethod: PaymentMethodType): BookingOrder => {
    const newOrder: BookingOrder = {
      id: `SR-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cartItems],
      subtotal,
      discountAmount,
      depositTotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      rentalStatus: 'booked'
    };

    setActiveBooking(newOrder);
    return newOrder;
  };

  const confirmPaymentSuccess = () => {
    if (!activeBooking) return;

    // Kurangi stok produk secara real-time
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const bookedItem = activeBooking.items.find(i => i.product.id === prod.id);
        if (bookedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - bookedItem.quantity)
          };
        }
        return prod;
      });
    });

    setActiveBooking(prev => prev ? { ...prev, paymentStatus: 'paid' } : null);
    clearCart();
  };

  return (
    <CartContext.Provider value={{
      products,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateDates,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      subtotal,
      discountAmount,
      depositTotal,
      deliveryFee,
      totalAmount,
      totalItemCount,
      isCartOpen,
      setIsCartOpen,
      selectedProductForModal,
      setSelectedProductForModal,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isTermsOpen,
      setIsTermsOpen,
      activeBooking,
      setActiveBooking,
      isPaymentSimulatorOpen,
      setIsPaymentSimulatorOpen,
      processBooking,
      confirmPaymentSuccess
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
