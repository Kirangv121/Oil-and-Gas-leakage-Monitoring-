"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function LineChartComponent({ title, data: initialData, dataKeys, colors, syncId }) {
  const [data, setData] = useState(initialData || [])

  // Simulate real-time data updates
  useEffect(() => {
    if (!initialData) return

    const interval = setInterval(() => {
      setData((prevData) => {
        // Create a copy of the last data point
        const lastPoint = { ...prevData[prevData.length - 1] }

        // Update values with small random changes
        dataKeys.forEach((key) => {
          const currentValue = lastPoint[key]
          const change = (Math.random() - 0.5) * 10 // Random change between -5 and 5
          lastPoint[key] = Math.max(0, currentValue + change)
        })

        // Update timestamp
        lastPoint.time = new Date().toLocaleTimeString()

        // Return updated data, removing the first point and adding the new one
        return [...prevData.slice(1), lastPoint]
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [initialData, dataKeys])

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 h-full">
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} syncId={syncId}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#475569",
                color: "#f8fafc",
              }}
            />
            <Legend wrapperStyle={{ color: "#f8fafc" }} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
