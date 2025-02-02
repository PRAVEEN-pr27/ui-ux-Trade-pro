import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Settings, Activity, RefreshCcw } from 'lucide-react';

interface DataPoint {
  date: string;
  price: number;
}

interface AnalyticsConfig {
  showMA: boolean;
  showRSI: boolean;
  showVolatility: boolean;
  maLength: number;
  rsiPeriod: number;
}

const AnalyticsDashboard = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [config, setConfig] = useState<AnalyticsConfig>({
    showMA: true,
    showRSI: true,
    showVolatility: true,
    maLength: 20,
    rsiPeriod: 14
  });

  // Generate random historical data
  const generateHistoricalData = () => {
    let price = 100;
    const dates = Array.from({ length: 100 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (100 - i));
      return date.toISOString().split('T')[0];
    });

    return dates.map(date => {
      price = price * (1 + (Math.random() - 0.5) * 0.02);
      return {
        date,
        price: Number(price.toFixed(2))
      };
    });
  };

  // Calculate Moving Average
  const calculateMA = (prices: number[], length: number) => {
    const ma = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < length - 1) {
        ma.push(null);
        continue;
      }
      const slice = prices.slice(i - length + 1, i + 1);
      const average = slice.reduce((a, b) => a + b, 0) / length;
      ma.push(Number(average.toFixed(2)));
    }
    return ma;
  };

  // Calculate RSI
  const calculateRSI = (prices: number[], period: number) => {
    const rsi = [];

    // Calculate price changes
    const changes = prices.map((price, i) => {
      if (i === 0) return 0;
      return price - prices[i - 1];
    });

    // Calculate initial average gain and loss
    for (let i = 0; i < prices.length; i++) {
      if (i < period) {
        rsi.push(null);
        continue;
      }

      const periodicChanges = changes.slice(i - period + 1, i + 1);
      const avgGain = periodicChanges.filter(change => change > 0).reduce((a, b) => a + b, 0) / period;
      const avgLoss = Math.abs(periodicChanges.filter(change => change < 0).reduce((a, b) => a + b, 0)) / period;

      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const RS = avgGain / avgLoss;
        rsi.push(Number((100 - (100 / (1 + RS))).toFixed(2)));
      }
    }

    return rsi;
  };

  // Calculate Volatility (Standard Deviation)
  const calculateVolatility = (prices: number[], period: number) => {
    const volatility = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        volatility.push(null);
        continue;
      }

      const slice = prices.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const squaredDiffs = slice.map(price => Math.pow(price - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
      const stdDev = Math.sqrt(variance);
      volatility.push(Number(stdDev.toFixed(2)));
    }

    return volatility;
  };

  // Process data with indicators
  const processData = (rawData: DataPoint[]) => {
    const prices = rawData.map(d => d.price);
    const ma = calculateMA(prices, config.maLength);
    const rsi = calculateRSI(prices, config.rsiPeriod);
    const volatility = calculateVolatility(prices, 20);

    return rawData.map((point, i) => ({
      ...point,
      ma: ma[i],
      rsi: rsi[i],
      volatility: volatility[i]
    }));
  };

  useEffect(() => {
    const historicalData = generateHistoricalData();
    setData(historicalData);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Financial Analytics Dashboard
            </CardTitle>
            <button 
              onClick={() => setData(generateHistoricalData())}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Price Chart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processData(data)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8884d8" 
                    name="Price"
                  />
                  {config.showMA && (
                    <Line 
                      type="monotone" 
                      dataKey="ma" 
                      stroke="#82ca9d" 
                      name={`${config.maLength} MA`}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RSI Chart */}
              {config.showRSI && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">RSI ({config.rsiPeriod})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processData(data)}>
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="rsi" 
                            stroke="#ff7300" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Volatility Chart */}
              {config.showVolatility && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Volatility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processData(data)}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="volatility" 
                            stroke="#82ca9d" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Dashboard Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showMA}
                      onChange={(e) => setConfig({ ...config, showMA: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                   <span className="text-gray-900">Moving Average</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showRSI}
                      onChange={(e) => setConfig({ ...config, showRSI: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">RSI</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showVolatility}
                      onChange={(e) => setConfig({ ...config, showVolatility: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                   <span className="text-gray-900">Volatility</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;