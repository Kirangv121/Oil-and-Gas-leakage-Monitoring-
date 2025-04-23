"use client"

import { useRouter } from "next/navigation"
import { Thermometer, Waves, Gauge, Zap, Radio, Droplet, Flame, Vibrate, Fuel, Ear } from "lucide-react"

export default function SensorCard({
  type,
  value,
  unit,
  status = "normal",
  min = 0,
  max = 100,
  current = 75,
  industrySlug,
  leakTypeSlug,
  sensorIndex,
}) {
  const router = useRouter()

  // Map sensor types to icons and colors
  const getSensorInfo = () => {
    switch (type.toLowerCase()) {
      case "temperature sensor":
        return { icon: <Thermometer className="h-6 w-6 text-red-500" />, color: "bg-red-500" }
      case "pressure sensor":
        return { icon: <Gauge className="h-6 w-6 text-blue-500" />, color: "bg-blue-500" }
      case "acoustic sensor":
        return { icon: <Ear className="h-6 w-6 text-purple-500" />, color: "bg-purple-500" }
      case "vibration sensor":
        return { icon: <Vibrate className="h-6 w-6 text-orange-500" />, color: "bg-orange-500" }
      case "mq-135 sensor":
        return { icon: <Radio className="h-6 w-6 text-green-500" />, color: "bg-green-500" }
      case "ir flame sensor":
        return { icon: <Flame className="h-6 w-6 text-red-500" />, color: "bg-red-500" }
      case "fuel & oil sensing cable":
      case "fuel cable":
      case "fuel sensor":
        return { icon: <Fuel className="h-6 w-6 text-yellow-500" />, color: "bg-yellow-500" }
      case "water-in-oil sensor":
        return { icon: <Droplet className="h-6 w-6 text-blue-500" />, color: "bg-blue-500" }
      case "capacitive fuel sensor":
      case "ultrasonic fuel level sensor":
        return { icon: <Gauge className="h-6 w-6 text-yellow-500" />, color: "bg-yellow-500" }
      case "soil moisture sensor":
        return { icon: <Droplet className="h-6 w-6 text-brown-500" />, color: "bg-amber-700" }
      case "humidity sensor":
        return { icon: <Droplet className="h-6 w-6 text-teal-500" />, color: "bg-teal-500" }
      case "power sensor":
        return { icon: <Zap className="h-6 w-6 text-yellow-500" />, color: "bg-yellow-500" }
      case "ultrasonic sensor":
        return { icon: <Waves className="h-6 w-6 text-cyan-500" />, color: "bg-cyan-500" }
      case "load sensor":
        return { icon: <Gauge className="h-6 w-6 text-blue-500" />, color: "bg-blue-500" }
      default:
        return { icon: <Radio className="h-6 w-6 text-gray-500" />, color: "bg-gray-500" }
    }
  }

  const { icon, color } = getSensorInfo()

  // Map status to colors and text
  const getStatusInfo = () => {
    switch (status.toLowerCase()) {
      case "normal":
        return { textColor: "text-green-500", checkmark: true }
      case "warning":
        return { textColor: "text-yellow-500", checkmark: false }
      case "fault":
        return { textColor: "text-red-500", checkmark: false }
      default:
        return { textColor: "text-gray-500", checkmark: false }
    }
  }

  const { textColor, checkmark } = getStatusInfo()

  // Generate random values if not provided
  const displayValue = value || (Math.random() * (max - min) + min).toFixed(1)
  const displayUnit =
    unit ||
    (type.toLowerCase().includes("temperature") ? "°C" : type.toLowerCase().includes("vibration") ? "Hz" : "psi")

  // Calculate percentage for progress bar
  const percentage = ((current - min) / (max - min)) * 100

  const handleClick = () => {
    const sensorTypeSlug = type.toLowerCase().replace(/\s+/g, "-")
    router.push(
      `/dashboard/industry/${industrySlug}/leak/${leakTypeSlug}/sensor/${sensorTypeSlug}?index=${sensorIndex}`,
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-gray-100 p-3 rounded-lg mr-3">{icon}</div>
          <h3 className="text-lg font-medium text-gray-800">{type}</h3>
        </div>
        {checkmark && (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">{displayValue}</span>
          <span className="ml-1 text-gray-500">{displayUnit}</span>
        </div>
      </div>

      <div className="mb-1">
        <span className={`font-medium ${textColor}`}>Status: {status}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>

      {/* Threshold markers */}
      <div className="relative h-6 mt-1">
        <div className="absolute left-[75%] w-0.5 h-3 bg-yellow-500 -top-3"></div>
        <div className="absolute left-[90%] w-0.5 h-3 bg-red-500 -top-3"></div>
      </div>
    </div>
  )
}
