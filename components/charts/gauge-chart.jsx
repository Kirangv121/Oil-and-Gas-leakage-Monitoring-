"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export default function GaugeChart({ title, value: initialValue, min = 0, max = 100, thresholds, unit = "%" }) {
  const [value, setValue] = useState(initialValue || 0)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => {
        const change = (Math.random() - 0.5) * 10 // Random change between -5 and 5
        return Math.min(max, Math.max(min, prevValue + change))
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [min, max])

  // Calculate color based on thresholds
  const getColor = (value) => {
    if (!thresholds) return "#10b981" // Default green

    for (const threshold of thresholds) {
      if (value <= threshold.value) {
        return threshold.color
      }
    }

    return thresholds[thresholds.length - 1]?.color || "#10b981"
  }

  // Calculate percentage for the gauge
  const percentage = ((value - min) / (max - min)) * 100
  const color = getColor(value)

  // Data for the semi-circle
  const data = [
    { name: "Value", value: percentage },
    { name: "Empty", value: 100 - percentage },
  ]

  // Custom label component
  const renderLabel = () => {
    return (
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#ffffff">
        {Math.round(value)}
        <tspan fontSize="0.8em">{unit}</tspan>
      </text>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 h-full">
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <div className="h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={0}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
            >
              <Cell key="value" fill={color} />
              <Cell key="empty" fill="#334155" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Min and Max labels */}
        <div className="absolute bottom-0 left-0 text-slate-400 text-sm">
          {min}
          {unit}
        </div>
        <div className="absolute bottom-0 right-0 text-slate-400 text-sm">
          {max}
          {unit}
        </div>
      </div>
    </div>
  )
}
