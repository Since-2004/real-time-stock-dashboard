"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface StockChartProps {
  data: ChartData[]
}

export default function StockChart({ data }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = { top: 20, right: 50, bottom: 30, left: 60 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Calculate price range
    const prices = data.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    const pricePadding = priceRange * 0.1

    // Scale functions
    const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth
    const yScale = (price: number) =>
      padding.top +
      chartHeight -
      ((price - (minPrice - pricePadding)) / (maxPrice + pricePadding - (minPrice - pricePadding))) * chartHeight

    // Draw grid
    ctx.strokeStyle = "rgba(200, 200, 200, 0.2)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const priceStep = priceRange > 100 ? 20 : priceRange > 50 ? 10 : 5
    for (let price = Math.floor(minPrice / priceStep) * priceStep; price <= maxPrice + priceStep; price += priceStep) {
      const y = yScale(price)
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(rect.width - padding.right, y)
      ctx.stroke()

      // Price labels
      ctx.fillStyle = "rgba(200, 200, 200, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`₹${price.toFixed(2)}`, padding.left - 5, y + 3)
    }

    // Vertical grid lines (time)
    const timeStep = Math.ceil(data.length / 6)
    for (let i = 0; i < data.length; i += timeStep) {
      const x = xScale(i)
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, rect.height - padding.bottom)
      ctx.stroke()

      // Time labels
      ctx.fillStyle = "rgba(200, 200, 200, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(data[i].time, x, rect.height - padding.bottom + 15)
    }

    // Draw candlesticks
    const candleWidth = (chartWidth / data.length) * 0.8

    data.forEach((d, i) => {
      const x = xScale(i)
      const open = yScale(d.open)
      const close = yScale(d.close)
      const high = yScale(d.high)
      const low = yScale(d.low)

      // Determine if it's an up or down candle
      const isUp = d.close >= d.open

      // Draw the wick (high to low line)
      ctx.beginPath()
      ctx.strokeStyle = isUp ? "rgba(0, 200, 0, 1)" : "rgba(255, 0, 0, 1)"
      ctx.lineWidth = 1
      ctx.moveTo(x, high)
      ctx.lineTo(x, low)
      ctx.stroke()

      // Draw the body (open to close rectangle)
      ctx.fillStyle = isUp ? "rgba(0, 200, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"
      ctx.fillRect(x - candleWidth / 2, isUp ? close : open, candleWidth, Math.abs(close - open))

      // Draw border around the body
      ctx.strokeStyle = isUp ? "rgba(0, 150, 0, 1)" : "rgba(200, 0, 0, 1)"
      ctx.lineWidth = 1
      ctx.strokeRect(x - candleWidth / 2, isUp ? close : open, candleWidth, Math.abs(close - open))
    })

    // Draw chart border
    ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"
    ctx.lineWidth = 1
    ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight)

    // Chart title
    ctx.fillStyle = "white"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("TradingView Style Candlestick Chart", padding.left, padding.top - 5)
  }, [data])

  return (
    <div className="relative w-full h-[400px] bg-[#131722] rounded-md">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
