export type ProductCategory = 
  | 'Semua'
  | 'DJ Gear' 
  | 'Gitar & Bass' 
  | 'Drum & Perkusi' 
  | 'Keyboard & Synth' 
  | 'Sound System' 
  | 'Microphone' 
  | 'Lighting & Stage';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  dailyPrice: number; // in IDR
  stock: number;
  image: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  isPromo: boolean;
  promoDiscountPercent?: number;
  promoTag?: string;
  depositAmount: number; // jaminan sewa (refundable)
  rating: number;
  reviewsCount: number;
  includedAccessories: string[];
}

export interface CartRentalItem {
  product: Product;
  quantity: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  rentalDays: number;
  itemSubtotal: number;
}

export interface PromoCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  description: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  eventCity: string;
  idCardNumber: string; // NIK KTP / SIM
  notes?: string;
}

export type PaymentMethodType = 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'credit_card';

export interface BookingOrder {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartRentalItem[];
  subtotal: number;
  discountAmount: number;
  depositTotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  rentalStatus: 'booked' | 'active' | 'returned';
}

export type UserRole = 'admin' | 'customer';
export interface AuthUser { id: string; fullName: string; email: string; role: UserRole; }
