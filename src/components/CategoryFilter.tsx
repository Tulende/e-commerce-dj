import React from 'react';
import { ProductCategory } from '../types';
import { SlidersHorizontal, Sparkles, CheckCircle2 } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  onlyPromo: boolean;
  setOnlyPromo: (val: boolean) => void;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating';
  setSortBy: (val: 'featured' | 'price_asc' | 'price_desc' | 'rating') => void;
  totalProductsCount: number;
}

const CATEGORIES: ProductCategory[] = [
  'Semua',
  'DJ Gear',
  'Gitar & Bass',
  'Drum & Perkusi',
  'Keyboard & Synth',
  'Sound System',
  'Microphone',
  'Lighting & Stage',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  onlyInStock,
  setOnlyInStock,
  onlyPromo,
  setOnlyPromo,
  sortBy,
  setSortBy,
  totalProductsCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none scroll-smooth">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Stock Filter, Promo Filter & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* In Stock toggle */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              onlyInStock
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Hanya Yang Tersedia</span>
          </button>

          {/* Promo toggle */}
          <button
            onClick={() => setOnlyPromo(!onlyPromo)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              onlyPromo
                ? 'bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sedang Promo</span>
          </button>
        </div>

        {/* Sorting & Counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Menampilkan <strong className="text-slate-200">{totalProductsCount}</strong> alat
          </span>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-900 text-white">Rekomendasi</option>
              <option value="price_asc" className="bg-slate-900 text-white">Harga: Terendah</option>
              <option value="price_desc" className="bg-slate-900 text-white">Harga: Tertinggi</option>
              <option value="rating" className="bg-slate-900 text-white">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
