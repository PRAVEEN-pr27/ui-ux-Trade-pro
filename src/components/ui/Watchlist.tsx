'use client';

import { StockData } from '../../lib/types';
import { WatchlistItem } from './WatchlistItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WatchlistProps {
  stocks: StockData[];
  onRemoveFromWatchlist: (id: string) => void;
}

export function Watchlist({ stocks, onRemoveFromWatchlist }: WatchlistProps) {
  return (
    <Card className="w-64 h-full">
      <CardHeader>
        <CardTitle className="text-gray-900">Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        {stocks.length === 0 ? (
          <p className="text-sm text-gray-500">No items in watchlist</p>
        ) : (
          <div className="space-y-3">
            {stocks.map(stock => (
              <WatchlistItem
                key={stock.id}
                stock={stock}
                onRemove={onRemoveFromWatchlist}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
