"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Info, XCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function AlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false)

  const getIcon = () => {
    switch (alert.severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "medium":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = () => {
    switch (alert.severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/50"
      case "high":
        return "bg-orange-500/10 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/50"
      case "low":
        return "bg-green-500/10 border-green-500/50"
      default:
        return "bg-blue-500/10 border-blue-500/50"
    }
  }

  return (
    <div className={`rounded-lg border p-4 mb-4 ${getSeverityColor()}`}>
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">{alert.title}</h3>
            <button onClick={() => setExpanded(!expanded)} className="p-1 rounded-full hover:bg-slate-700/50">
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </div>
          <p className="text-slate-300 mt-1">{alert.message}</p>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-400">Location</p>
                  <p className="text-white">{alert.location}</p>
                </div>
                <div>
                  <p className="text-slate-400">Asset ID</p>
                  <p className="text-white">{alert.assetId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Time</p>
                  <p className="text-white">{alert.time}</p>
                </div>
                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="text-white capitalize">{alert.status}</p>
                </div>
              </div>

              {alert.recommendations && (
                <div className="mt-3">
                  <p className="text-slate-400 mb-1">Recommended Actions:</p>
                  <ul className="list-disc list-inside text-white text-sm">
                    {alert.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex justify-end space-x-2">
                <button className="px-3 py-1 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600 transition-colors">
                  Acknowledge
                </button>
                <button className="px-3 py-1 bg-yellow-500 text-slate-900 rounded-md text-sm hover:bg-yellow-400 transition-colors">
                  Resolve
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
