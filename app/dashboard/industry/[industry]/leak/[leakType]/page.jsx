"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { BarChart2, Activity } from "lucide-react"

import Sidebar from "../../../../../../components/sidebar"
import Header from "../../../../../../components/header"
import BackButton from "../../../../../../components/back-button"
import SensorCard from "../../../../../../components/sensor-card"
import { industryData } from "../../../../../../lib/industry-data"

export default function LeakTypeDetail() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [industry, setIndustry] = useState(null)
  const [leakType, setLeakType] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Get industry and leak type data
    const industrySlug = params.industry
    const leakTypeSlug = params.leakType

    if (industryData[industrySlug]) {
      setIndustry({
        slug: industrySlug,
        ...industryData[industrySlug],
      })

      // Find the leak type
      const foundLeakType = industryData[industrySlug].leakTypes.find(
        (lt) => lt.title.toLowerCase().replace(/\s+/g, "-") === leakTypeSlug,
      )

      if (foundLeakType) {
        setLeakType(foundLeakType)
      } else {
        router.push(`/dashboard/industry/${industrySlug}`)
      }
    } else {
      router.push("/dashboard")
    }
  }, [router, params])

  if (!user || !industry || !leakType) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  // Generate sensor data with random values and statuses
  const statuses = ["Normal", "Warning", "Fault"]
  const sensorsWithData = leakType.sensors.map((sensor, index) => {
    const randomStatus = Math.random() > 0.7 ? statuses[Math.floor(Math.random() * 3)] : "Normal"

    // Generate random values based on sensor type
    let min = 0
    let max = 100
    let current = Math.random() * 100
    let unit = ""

    if (sensor.toLowerCase().includes("temperature")) {
      min = 20
      max = 120
      current = Math.random() * (max - min) + min
      unit = "°C"
    } else if (sensor.toLowerCase().includes("pressure")) {
      min = 0
      max = 200
      current = Math.random() * (max - min) + min
      unit = "psi"
    } else if (sensor.toLowerCase().includes("vibration")) {
      min = 100
      max = 1000
      current = Math.random() * (max - min) + min
      unit = "Hz"
    } else if (sensor.toLowerCase().includes("acoustic")) {
      min = 30
      max = 120
      current = Math.random() * (max - min) + min
      unit = "dB"
    }

    return {
      type: sensor,
      status: randomStatus,
      value: current.toFixed(1),
      unit,
      min,
      max,
      current,
    }
  })

  const leakTypeSlug = leakType.title.toLowerCase().replace(/\s+/g, "-")

  const handlePredictiveMaintenanceClick = () => {
    router.push("/dashboard/predictive-maintenance")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header title={`${industry.title} - ${leakType.title}`} />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold">{leakType.title}</h2>
            </div>
            <p className="text-slate-400">{leakType.description}</p>

            <div className="mt-4">
              <button
                onClick={handlePredictiveMaintenanceClick}
                className="flex items-center px-4 py-2 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 transition-colors"
              >
                <Activity className="h-5 w-5 mr-2" />
                View Predictive Maintenance
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {industry.title.toUpperCase()} - {leakType.title.toUpperCase()}
            </h3>
            <p className="text-slate-400 text-center mb-6">Real-time sensor data monitoring and analysis</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sensorsWithData.map((sensor, index) => (
                <SensorCard
                  key={index}
                  type={sensor.type}
                  value={sensor.value}
                  unit={sensor.unit}
                  status={sensor.status}
                  min={sensor.min}
                  max={sensor.max}
                  current={sensor.current}
                  industrySlug={industry.slug}
                  leakTypeSlug={leakTypeSlug}
                  sensorIndex={index}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-medium mb-4">Sensor Health Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300">Operational Sensors</span>
                    <span className="text-green-500 font-medium">75%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300">Warning State</span>
                    <span className="text-yellow-500 font-medium">15%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300">Fault State</span>
                    <span className="text-red-500 font-medium">10%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                    <div>
                      <h4 className="font-medium text-white">Critical Alert</h4>
                      <p className="text-sm text-slate-300">Pressure sensor reading above threshold</p>
                      <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></div>
                    <div>
                      <h4 className="font-medium text-white">Warning Alert</h4>
                      <p className="text-sm text-slate-300">Temperature rising in section A</p>
                      <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                    <div>
                      <h4 className="font-medium text-white">Maintenance Completed</h4>
                      <p className="text-sm text-slate-300">Acoustic sensor calibration successful</p>
                      <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
