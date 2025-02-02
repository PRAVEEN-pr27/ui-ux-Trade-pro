'use client';

import { StockData } from '../../lib/types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WatchlistItemProps {
  stock: StockData;
  onRemove: (id: string) => void;
}

export function WatchlistItem({ stock, onRemove }: WatchlistItemProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-lg bg-white shadow-sm">
      <div className="flex flex-col">
        <span className="font-bold text-gray-900">{stock.symbol}</span>
        <span className="text-gray-700">${stock.price.toFixed(2)}</span>
        <span className={`text-sm ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock.change}%
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(stock.id)}
         className="p-2 rounded-full hover:bg-gray-100"
      >
        <Trash2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />
      </Button>
    </div>
  );
}
