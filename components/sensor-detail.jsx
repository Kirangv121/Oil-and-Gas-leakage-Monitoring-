export default function SensorDetail({ name, status = "active", lastReading, unit, threshold, currentValue }) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      case "maintenance":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="bg-slate-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">{name}</h4>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2`}></div>
          <span className="text-sm capitalize">{status}</span>
        </div>
      </div>

      {lastReading && <div className="text-sm text-slate-400 mb-2">Last reading: {lastReading}</div>}

      {currentValue !== undefined && threshold !== undefined && unit && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>
              Current: {currentValue}
              {unit}
            </span>
            <span>
              Threshold: {threshold}
              {unit}
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${currentValue > threshold ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${Math.min(100, (currentValue / threshold) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
