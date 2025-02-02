'use client';

import { StockData } from '../../lib/types';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StockCardProps {
  stock: StockData;
  onAddToWatchlist: (stock: StockData) => void;
  isWatched: boolean;
}

export function StockCard({ stock, onAddToWatchlist, isWatched }: StockCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
      <div>
        <span className="font-bold  text-gray-900">{stock.symbol}</span>
        <span className="ml-4 text-gray-700">${stock.price.toFixed(2)}</span>
        <span className={`ml-2 ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock.change}%
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddToWatchlist(stock)}
        disabled={isWatched}
      >
        <Star 
  className={`h-4 w-4 stroke-2 transition-colors ${
    isWatched 
      ? 'fill-yellow-400 stroke-yellow-400' 
      : 'fill-transparent stroke-gray-400 hover:stroke-gray-600'
  }`}/>
      </Button>
    </div>
  );
}