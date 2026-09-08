import { Product } from './index';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  suggestedPrompts?: string[];
  bundleSummary?: {
    packageName: string;
    totalDailyPrice: number;
    discountedDailyPrice?: number;
    productIds: string[];
  };
}

export interface AIPromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  category: 'dj' | 'band' | 'budget' | 'sound' | 'promo';
}
