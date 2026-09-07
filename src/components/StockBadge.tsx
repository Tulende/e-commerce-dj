import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/60 shadow-sm">
        <XCircle className="w-3.5 h-3.5" />
        Stok Tersewa / Habis
      </span>
    );
  }

  if (stock <= 2) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow-sm animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" />
        Sisa {stock} Unit Lagi!
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Tersedia ({stock} Unit)
    </span>
  );
};
