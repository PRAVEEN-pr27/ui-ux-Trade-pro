import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types for our data
interface AssetSentiment {
  id: string;
  symbol: string;
  price: number;
  sentiment: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    keywords: string[];
    confidence: number;
  };
}

const SentimentAnalysis = () => {
  const [assets, setAssets] = useState<AssetSentiment[]>([]);

  // Generate random sentiment data
  const generateSentimentData = () => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NFLX'];
    const keywords = [
      'strong growth', 'market leader', 'innovation', 'quarterly results',
      'product launch', 'market share', 'competition', 'regulatory concerns',
      'earnings report', 'industry trends'
    ];

    return symbols.map(symbol => {
      const score = Number((Math.random() * 2 - 1).toFixed(2)); // -1 to 1
      let label: 'positive' | 'neutral' | 'negative';
      if (score > 0.3) label = 'positive';
      else if (score < -0.3) label = 'negative';
      else label = 'neutral';

      // Random selection of keywords
      const selectedKeywords = Array.from({ length: 3 }, () => 
        keywords[Math.floor(Math.random() * keywords.length)]
      );

      return {
        id: symbol,
        symbol,
        price: Math.random() * 1000 + 100,
        sentiment: {
          score,
          label,
          keywords: selectedKeywords,
          confidence: Number((Math.random() * 0.4 + 0.6).toFixed(2)) // 0.6 to 1.0
        }
      };
    });
  };

  useEffect(() => {
    // Initial data generation
    setAssets(generateSentimentData());

    // Update sentiment every 30 seconds
    const interval = setInterval(() => {
      setAssets(generateSentimentData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BarChart className="w-6 h-6" />
          <CardTitle text-gray-900>Market Sentiment Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assets.map(asset => (
            <div key={asset.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4 text-gray-900">
                  <span className="font-bold text-lg  ">{asset.symbol}</span>
                  <span className="text-gray-600">${asset.price.toFixed(2)}</span>
                </div>
                {getSentimentIcon(asset.sentiment.label)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sentiment Score:</span>
                  <span className={`font-medium ${getSentimentColor(asset.sentiment.score)}`}>
                    {asset.sentiment.score.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Confidence:</span>
                  <span className="font-medium">{(asset.sentiment.confidence * 100).toFixed(1)}%</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {asset.sentiment.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;