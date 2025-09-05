import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"

interface ActionButtonsProps {
  prediction: string
}

export default function ActionButtons({ prediction }: ActionButtonsProps) {
  const isBuy = prediction === "BUY"
  const isSell = prediction === "SELL"

  return (
    <div className="flex gap-4 w-full">
      <Button className="flex-1 h-12 text-lg" variant={isBuy ? "default" : "outline"} disabled={!isBuy}>
        <ArrowUp className="mr-2 h-5 w-5" />
        BUY SHARES
      </Button>

      <Button className="flex-1 h-12 text-lg" variant={isSell ? "destructive" : "outline"} disabled={!isSell}>
        <ArrowDown className="mr-2 h-5 w-5" />
        SELL SHARES
      </Button>
    </div>
  )
}
