"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import Sidebar from "../../../../../../../../components/sidebar"
import Header from "../../../../../../../../components/header"
import BackButton from "../../../../../../../../components/back-button"
import { industryData } from "../../../../../../../../lib/industry-data"
import { generateSensorTimeSeriesData, generateOperatingInfo } from "../../../../../../../../lib/sensor-data"
import { Thermometer, Waves, Gauge, Zap, Radio, Droplet, Flame, Vibrate, Fuel, Ear } from "lucide-react"

export default function SensorDetail() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [industry, setIndustry] = useState(null)
  const [leakType, setLeakType] = useState(null)
  const [sensorData, setSensorData] = useState(null)
  const [operatingInfo, setOperatingInfo] = useState(null)
  const [sensorType, setSensorType] = useState("")

  // Use a ref to track initialization
  const initialized = useRef(false)
  const sensorTypeRef = useRef("")

  // First effect just for authentication and basic data loading
  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  // Second effect for loading industry and leak type data
  useEffect(() => {
    if (!user) return

    const industrySlug = params.industry
    const leakTypeSlug = params.leakType

    if (industryData[industrySlug]) {
      const industryData_ = {
        slug: industrySlug,
        ...industryData[industrySlug],
      }
      setIndustry(industryData_)

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
  }, [user, params, router])

  // Third effect for sensor data generation - only runs once per sensor type
  useEffect(() => {
    if (!user || !industry || !leakType) return

    const sensorTypeSlug = params.sensorType
    const sensorIndex = searchParams.get("index") || 0

    // Find the sensor
    const sensorType_ = leakType.sensors[sensorIndex]

    if (sensorType_) {
      setSensorType(sensorType_)

      // Only generate data if we haven't already for this sensor type
      if (sensorTypeRef.current !== sensorType_) {
        sensorTypeRef.current = sensorType_

        // Generate sensor data
        const data = generateSensorTimeSeriesData(sensorType_)
        setSensorData(data)

        // Generate operating info
        setOperatingInfo(generateOperatingInfo())
      }
    } else {
      router.push(`/dashboard/industry/${industry.slug}/leak/${leakType.title.toLowerCase().replace(/\s+/g, "-")}`)
    }
  }, [user, industry, leakType, params, searchParams, router])

  if (!user || !industry || !leakType || !sensorData || !operatingInfo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  // Get sensor icon
  const getSensorIcon = () => {
    switch (sensorType.toLowerCase()) {
      case "temperature sensor":
        return <Thermometer className="h-6 w-6 text-red-500" />
      case "pressure sensor":
        return <Gauge className="h-6 w-6 text-blue-500" />
      case "acoustic sensor":
        return <Ear className="h-6 w-6 text-purple-500" />
      case "vibration sensor":
        return <Vibrate className="h-6 w-6 text-orange-500" />
      case "mq-135 sensor":
        return <Radio className="h-6 w-6 text-green-500" />
      case "ir flame sensor":
        return <Flame className="h-6 w-6 text-red-500" />
      case "fuel & oil sensing cable":
      case "fuel cable":
      case "fuel sensor":
        return <Fuel className="h-6 w-6 text-yellow-500" />
      case "water-in-oil sensor":
        return <Droplet className="h-6 w-6 text-blue-500" />
      case "capacitive fuel sensor":
      case "ultrasonic fuel level sensor":
        return <Gauge className="h-6 w-6 text-yellow-500" />
      case "soil moisture sensor":
        return <Droplet className="h-6 w-6 text-amber-700" />
      case "humidity sensor":
        return <Droplet className="h-6 w-6 text-teal-500" />
      case "power sensor":
        return <Zap className="h-6 w-6 text-yellow-500" />
      case "ultrasonic sensor":
        return <Waves className="h-6 w-6 text-cyan-500" />
      case "load sensor":
        return <Gauge className="h-6 w-6 text-blue-500" />
      default:
        return <Radio className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header title={`${industry.title} - ${leakType.title} - ${sensorType}`} />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">
            {industry.title.toUpperCase()} - {leakType.title.toUpperCase()} - {sensorType.toUpperCase()}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main chart area - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 p-2 rounded-lg mr-2">{getSensorIcon()}</div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {sensorType} ({sensorData.unit})
                  </h3>
                  <div
                    className={`ml-auto px-3 py-1 rounded-full ${
                      sensorData.status === "Normal"
                        ? "bg-green-100 text-green-800"
                        : sensorData.status === "Warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sensorData.status}
                  </div>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorData.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e5e7eb",
                          color: "#111827",
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
                      {/* Warning threshold line */}
                      <Line
                        type="monotone"
                        dataKey={() => sensorData.warningThreshold}
                        stroke="#f59e0b"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      {/* Fault threshold line */}
                      <Line
                        type="monotone"
                        dataKey={() => sensorData.faultThreshold}
                        stroke="#ef4444"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current value */}
              <div className="bg-green-500 rounded-lg shadow-md p-4 text-white">
                <h3 className="text-lg font-medium mb-2">CURRENT VALUE</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold">{sensorData.currentValue}</span>
                  <span className="ml-1 text-xl">{sensorData.unit}</span>
                </div>
                <div className="text-center mt-2 font-medium">{sensorData.status}</div>
              </div>

              {/* Thresholds */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4 bg-gray-900 text-white p-2">THRESHOLDS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Warning</span>
                    <span className="text-yellow-500 font-medium">
                      {sensorData.warningThreshold} {sensorData.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Fault</span>
                    <span className="text-red-500 font-medium">
                      {sensorData.faultThreshold} {sensorData.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operating info */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4 bg-gray-900 text-white p-2">OPERATING INFO</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Operating Hours</span>
                    <span className="text-gray-600 font-medium">{operatingInfo.operatingHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Last Updated</span>
                    <span className="text-gray-600 font-medium">{operatingInfo.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Sensor Specifications</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sensor Type</span>
                  <span className="text-gray-800 font-medium">{sensorType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Measurement Range</span>
                  <span className="text-gray-800 font-medium">
                    0 - {sensorData.faultThreshold * 1.5} {sensorData.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="text-gray-800 font-medium">
                    ±{(sensorData.faultThreshold * 0.02).toFixed(2)} {sensorData.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calibration Date</span>
                  <span className="text-gray-800 font-medium">
                    {new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Maintenance History</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3 py-1">
                  <div className="text-gray-800 font-medium">Routine Calibration</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3 py-1">
                  <div className="text-gray-800 font-medium">Sensor Firmware Update</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div className="border-l-4 border-red-500 pl-3 py-1">
                  <div className="text-gray-800 font-medium">Emergency Replacement</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString()}
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
