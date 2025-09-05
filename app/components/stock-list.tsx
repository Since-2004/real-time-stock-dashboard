"use client"
import { TrendingDown, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
}

interface StockListProps {
  stocks: Stock[]
  selectedSymbol: string
  onSelectStock: (symbol: string) => void
}

export default function StockList({ stocks, selectedSymbol, onSelectStock }: StockListProps) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-1">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
              selectedSymbol === stock.symbol ? "bg-muted" : ""
            }`}
            onClick={() => onSelectStock(stock.symbol)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-xs text-muted-foreground">{stock.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium">₹{stock.price.toFixed(2)}</span>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                  )}
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
