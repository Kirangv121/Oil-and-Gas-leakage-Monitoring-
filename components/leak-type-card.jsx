"use client"

import { useRouter } from "next/navigation"
import {
  Droplet,
  Activity,
  AlertTriangle,
  Flame,
  Truck,
  Train,
  Ship,
  Warehouse,
  Plane,
  ContainerIcon as Tank,
  Construction,
  Fuel,
} from "lucide-react"

export default function LeakTypeCard({ industry, leakType, status = "normal" }) {
  const router = useRouter()

  // Map leak types to icons
  const getIcon = () => {
    switch (leakType.title.toLowerCase()) {
      case "pipeline corrosion":
        return <Droplet className="h-5 w-5 text-blue-400" />
      case "faulty valves":
        return <Activity className="h-5 w-5 text-purple-400" />
      case "pressure surges":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "blowouts":
        return <Flame className="h-5 w-5 text-red-500" />
      case "tanker truck rollovers":
        return <Truck className="h-5 w-5 text-blue-400" />
      case "railcar valve/seal failures":
        return <Train className="h-5 w-5 text-purple-400" />
      case "ship leakages":
        return <Ship className="h-5 w-5 text-teal-400" />
      case "fuel tank leaks":
        return <Fuel className="h-5 w-5 text-yellow-500" />
      case "pipeline leaks":
        return <Droplet className="h-5 w-5 text-blue-400" />
      case "undetected storage leaks":
        return <Warehouse className="h-5 w-5 text-gray-400" />
      case "fuel/hydraulic leaks":
        return <Droplet className="h-5 w-5 text-red-400" />
      case "military base tank leaks":
        return <Tank className="h-5 w-5 text-green-400" />
      case "jet fuel leakages":
        return <Plane className="h-5 w-5 text-blue-400" />
      case "machinery fuel leaks":
        return <Construction className="h-5 w-5 text-yellow-400" />
      case "storage tank ruptures":
        return <Tank className="h-5 w-5 text-red-400" />
      case "fuel theft":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  // Map status to colors
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "normal":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "fault":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case "fault":
        return (
          <div className="absolute top-3 right-3 rounded-full bg-red-500 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        )
      case "warning":
        return (
          <div className="absolute top-3 right-3 rounded-full bg-yellow-500 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const handleClick = () => {
    router.push(
      `/dashboard/industry/${industry}/leak/${encodeURIComponent(leakType.title.toLowerCase().replace(/\s+/g, "-"))}`,
    )
  }

  return (
    <div
      className="bg-slate-800 rounded-lg border border-slate-700 p-4 relative cursor-pointer hover:border-yellow-500 transition-colors"
      onClick={handleClick}
    >
      {getStatusIcon()}
      <div className="flex items-center mb-2">
        <div className="mr-2">{getIcon()}</div>
        <h3 className="text-lg font-medium text-white">{leakType.title}</h3>
      </div>
      <p className="text-slate-300 text-sm mb-3">{leakType.description}</p>
      <div className="flex items-center mt-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2`}></div>
        <span className="text-sm text-slate-300 capitalize">Status: {status}</span>
      </div>
      <div className="text-sm text-slate-400 mt-1">
        <span>{leakType.sensors.length} sensors available</span>
      </div>
    </div>
  )
}
