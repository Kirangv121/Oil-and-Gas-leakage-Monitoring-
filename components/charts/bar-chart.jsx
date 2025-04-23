"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function BarChartComponent({ title, data: initialData, dataKeys, colors, syncId }) {
  const [data, setData] = useState(initialData || [])

  // Simulate real-time data updates
  useEffect(() => {
    if (!initialData) return

    const interval = setInterval(() => {
      setData((prevData) => {
        // Create a copy of the data
        const newData = [...prevData]

        // Update a random data point with small changes
        const randomIndex = Math.floor(Math.random() * newData.length)
        dataKeys.forEach((key) => {
          const currentValue = newData[randomIndex][key]
          const change = (Math.random() - 0.5) * 10 // Random change between -5 and 5
          newData[randomIndex][key] = Math.max(0, currentValue + change)
        })

        return newData
      })
    }, 7000) // Update every 7 seconds

    return () => clearInterval(interval)
  }, [initialData, dataKeys])

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 h-full">
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} syncId={syncId}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
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
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
