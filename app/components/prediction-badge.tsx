import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface PredictionBadgeProps {
  prediction: string
}

export default function PredictionBadge({ prediction }: PredictionBadgeProps) {
  let variant: "default" | "success" | "destructive" | "secondary" = "default"
  let icon = null

  switch (prediction) {
    case "BUY":
      variant = "success"
      icon = <ArrowUp className="h-4 w-4" />
      break
    case "SELL":
      variant = "destructive"
      icon = <ArrowDown className="h-4 w-4" />
      break
    case "HOLD":
      variant = "secondary"
      icon = <Minus className="h-4 w-4" />
      break
  }

  return (
    <Badge variant={variant} className="text-lg py-2 px-4 flex items-center gap-2">
      {icon}
      Prediction: {prediction}
    </Badge>
  )
}
