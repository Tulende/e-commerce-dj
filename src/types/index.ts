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

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
  eventType?: string; // misal: 'Pesta Ulang Tahun', 'Gig Kafe', 'Wedding', 'Latihan Studio'
  userAvatar?: string;
  verifiedRental?: boolean;
}

export interface CustomerCRM {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  idCardNumber: string;
  totalOrders: number;
  totalSpent: number;
  lastRentalDate: string;
  tier: 'Regular' | 'Silver' | 'Gold' | 'VIP';
  notes?: string;
}

export type PipelineStage = 'lead' | 'negosiasi' | 'deal' | 'selesai' | 'batal';

export interface PipelineDeal {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  stage: PipelineStage;
  value: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  expectedCloseDate?: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  type: 'jatuh_tempo' | 'follow_up_lead' | 'ucapan' | 'penawaran';
  message: string;
  scheduledDate: string;
  isDone: boolean;
}
