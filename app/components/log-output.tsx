import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Log {
  symbol: string
  prediction: string
  sentiment: number
  time: string
}

interface LogOutputProps {
  logs: Log[]
  price: number
}

export default function LogOutput({ logs, price }: LogOutputProps) {
  if (logs.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No prediction logs yet. Waiting for data...</div>
  }

  return (
    <ScrollArea className="h-[200px] rounded-md border">
      <div className="p-4 font-mono text-sm">
        {logs.map((log, index) => {
          // Generate a realistic price variation for each log entry
          const logPrice = price + (Math.random() - 0.5) * (price * 0.01)

          return (
            <div key={index} className="flex items-center gap-2 py-1 border-b last:border-0">
              <span className="font-medium">{log.symbol}:</span>
              <Badge
                variant={log.prediction === "BUY" ? "success" : log.prediction === "SELL" ? "destructive" : "secondary"}
                className="px-2"
              >
                {log.prediction} @ ₹{logPrice.toFixed(2)}
              </Badge>
              <span>|</span>
              <span className="flex items-center gap-1">
                Sentiment:
                <span className={log.sentiment > 0 ? "text-green-500" : log.sentiment < 0 ? "text-red-500" : ""}>
                  {log.sentiment > 0 ? "+" : ""}
                  {log.sentiment.toFixed(2)}
                </span>
              </span>
              <span>|</span>
              <span className="text-muted-foreground">Time: {log.time}</span>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
