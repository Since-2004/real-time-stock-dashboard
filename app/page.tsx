"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingDown, TrendingUp } from "lucide-react"
import StockChart from "./components/stock-chart"
import PredictionBadge from "./components/prediction-badge"
import ActionButtons from "./components/action-buttons"
import LogOutput from "./components/log-output"
import StockList from "./components/stock-list"

// Mock stocks data
const mockStocks = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 1548.75,
    change: 12.5,
    changePercent: 0.81,
    volume: "2.4M",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy",
    price: 3245.6,
    change: -15.3,
    changePercent: -0.47,
    volume: "1.1M",
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank",
    price: 1678.25,
    change: 5.75,
    changePercent: 0.34,
    volume: "3.2M",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: 1420.8,
    change: -8.2,
    changePercent: -0.57,
    volume: "1.8M",
  },
  {
    symbol: "ICICI",
    name: "ICICI Bank",
    price: 945.3,
    change: 3.45,
    changePercent: 0.37,
    volume: "2.1M",
  },
  {
    symbol: "WIPRO",
    name: "Wipro Limited",
    price: 412.75,
    change: 1.25,
    changePercent: 0.3,
    volume: "1.5M",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 624.5,
    change: -2.3,
    changePercent: -0.37,
    volume: "2.7M",
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies",
    price: 1156.4,
    change: 7.8,
    changePercent: 0.68,
    volume: "0.9M",
  },
]

// Generate realistic candlestick data for a stock
const generateStockData = (basePrice: number, volatility: number) => {
  return Array.from({ length: 30 }, (_, i) => {
    const trend = Math.sin(i / 5) * volatility + (Math.random() - 0.5) * volatility * 0.5
    const open = basePrice + trend
    const close = open + (Math.random() - 0.5) * volatility
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5)
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5)
    const volume = Math.floor(Math.random() * 10000) + 5000

    return {
      time: `${Math.floor(i / 6) + 9}:${(i % 6) * 10 || "00"}`,
      open,
      high,
      low,
      close,
      volume,
    }
  })
}

export default function Home() {
  const [stocks, setStocks] = useState(mockStocks)
  const [selectedStock, setSelectedStock] = useState(mockStocks[0])
  const [chartData, setChartData] = useState(generateStockData(selectedStock.price, selectedStock.price * 0.03))
  const [prediction, setPrediction] = useState("BUY")
  const [sentiment, setSentiment] = useState(0.42)
  const [logs, setLogs] = useState<Array<{ symbol: string; prediction: string; sentiment: number; time: string }>>([])

  // Update chart data when selected stock changes
  useEffect(() => {
    setChartData(generateStockData(selectedStock.price, selectedStock.price * 0.03))
  }, [selectedStock])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stock prices
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const changeAmount = (Math.random() - 0.5) * (stock.price * 0.01)
          const newPrice = stock.price + changeAmount
          return {
            ...stock,
            price: Number.parseFloat(newPrice.toFixed(2)),
            change: Number.parseFloat((newPrice - stock.price + stock.change).toFixed(2)),
            changePercent: Number.parseFloat(
              (((newPrice - stock.price + stock.change) / stock.price) * 100).toFixed(2),
            ),
          }
        }),
      )

      // Update selected stock chart data
      const lastClose = chartData[chartData.length - 1].close
      const volatility = selectedStock.price * 0.01
      const newOpen = lastClose
      const newClose = newOpen + (Math.random() - 0.5) * volatility * 2
      const newHigh = Math.max(newOpen, newClose) + Math.random() * volatility
      const newLow = Math.min(newOpen, newClose) - Math.random() * volatility
      const newVolume = Math.floor(Math.random() * 10000) + 5000

      setChartData((prevData) => [
        ...prevData.slice(1),
        {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          open: newOpen,
          high: newHigh,
          low: newLow,
          close: newClose,
          volume: newVolume,
        },
      ])

      // Update prediction and sentiment
      const predictions = ["BUY", "SELL", "HOLD"]
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]
      const randomSentiment = Number.parseFloat((Math.random() * 2 - 1).toFixed(2))

      setPrediction(randomPrediction)
      setSentiment(randomSentiment)

      // Add to logs
      const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      setLogs((prevLogs) => [
        {
          symbol: selectedStock.symbol,
          prediction: randomPrediction,
          sentiment: randomSentiment,
          time: currentTime,
        },
        ...prevLogs.slice(0, 9), // Keep only the last 10 logs
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [chartData, selectedStock])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Indian Stock Market Predictor</h1>
        <p className="mt-2 text-muted-foreground">Analyzing NSE/BSE trends and predicting stock movements</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <StockList
                stocks={stocks}
                selectedSymbol={selectedStock.symbol}
                onSelectStock={(symbol) => {
                  const stock = stocks.find((s) => s.symbol === symbol)
                  if (stock) setSelectedStock(stock)
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                {selectedStock.symbol} - {selectedStock.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-lg font-bold">
                  ₹{selectedStock.price.toFixed(2)}
                </Badge>
                <Badge
                  variant={selectedStock.change >= 0 ? "success" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {selectedStock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {selectedStock.change >= 0 ? "+" : ""}
                  {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Real-time
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <StockChart data={chartData} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4">
                  <PredictionBadge prediction={prediction} />

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sentiment Score:</span>
                    <Badge
                      variant={sentiment > 0 ? "success" : sentiment < 0 ? "destructive" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {sentiment > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : sentiment < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {sentiment > 0 ? "+" : ""}
                      {sentiment.toFixed(2)}
                    </Badge>
                  </div>

                  <ActionButtons prediction={prediction} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Prediction Log</CardTitle>
              </CardHeader>
              <CardContent>
                <LogOutput logs={logs} price={selectedStock.price} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
