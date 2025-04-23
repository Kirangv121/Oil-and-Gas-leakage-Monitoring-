"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Activity,
  CheckCircle,
  Thermometer,
  Vibrate,
  Volume2,
  Weight,
  Droplet,
  Gauge,
  Radio,
  Flame,
  Ear,
  Fuel,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import BackButton from "../../../components/back-button"
import { generatePredictiveData } from "../../../lib/predictive-data"
import { industryData } from "../../../lib/industry-data"
import { generateSensorTimeSeriesData } from "../../../lib/sensor-data"

export default function PredictiveMaintenance() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [predictiveData, setPredictiveData] = useState(null)
  const [faults, setFaults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [sensorHealthData, setSensorHealthData] = useState([])

  // Use a ref to track initialization
  const initialized = useRef(false)

  // Authentication effect
  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // If user is an operator, check for selected industry
    if (parsedUser.role === "operator") {
      const selectedIndustryData = localStorage.getItem("selectedIndustry")
      if (!selectedIndustryData) {
        router.push("/industry-selection")
        return
      }

      const industry = JSON.parse(selectedIndustryData)
      // You could set this to state if needed for filtering
    }
  }, [router])

  // Data loading effect
  useEffect(() => {
    if (!user) return

    // Only generate data once
    if (!initialized.current) {
      initialized.current = true

      // Generate predictive maintenance data
      const data = generatePredictiveData()
      setPredictiveData(data)

      // Set faults based on component health
      const newFaults = []

      if (data.components.temperature.health < 30) {
        newFaults.push({
          id: 1,
          component: "Temperature System",
          severity: "critical",
          message: "Critical temperature levels detected in pump bearing assembly",
          timestamp: new Date().toLocaleString(),
          readings: `${data.components.temperature.current}°C (Threshold: ${data.components.temperature.threshold}°C)`,
          location: "Pump Station 3, Unit B",
          recommendations: [
            "Shut down pump immediately to prevent catastrophic failure",
            "Inspect cooling system for blockages or failures",
            "Check lubrication system and replace if necessary",
            "Inspect bearing assembly for wear or damage",
          ],
        })
      }

      if (data.components.vibration.health < 50) {
        newFaults.push({
          id: 2,
          component: "Vibration System",
          severity: "warning",
          message: "Abnormal vibration patterns detected in compressor unit",
          timestamp: new Date().toLocaleString(),
          readings: `${data.components.vibration.current} Hz (Threshold: ${data.components.vibration.threshold} Hz)`,
          location: "Compressor Station 2",
          recommendations: [
            "Schedule maintenance within 48 hours",
            "Inspect shaft alignment and correct if necessary",
            "Check for loose mounting bolts and tighten",
            "Inspect bearings for wear and replace if needed",
          ],
        })
      }

      if (data.components.sound.health < 60) {
        newFaults.push({
          id: 3,
          component: "Sound System",
          severity: "warning",
          message: "Unusual acoustic signature detected in valve assembly",
          timestamp: new Date().toLocaleString(),
          readings: `${data.components.sound.current} dB (Threshold: ${data.components.sound.threshold} dB)`,
          location: "Pipeline Section A, Valve Cluster 5",
          recommendations: [
            "Inspect valve for internal leakage or cavitation",
            "Check valve seat and replace if damaged",
            "Verify proper flow conditions and adjust if necessary",
            "Consider replacement if valve shows signs of extensive wear",
          ],
        })
      }

      if (data.components.load.health < 40) {
        newFaults.push({
          id: 4,
          component: "Load System",
          severity: "critical",
          message: "Excessive load detected on transfer pump motor",
          timestamp: new Date().toLocaleString(),
          readings: `${data.components.load.current} kW (Threshold: ${data.components.load.threshold} kW)`,
          location: "Transfer Station 4",
          recommendations: [
            "Reduce operational load immediately",
            "Inspect for mechanical obstructions in pump assembly",
            "Check for fluid viscosity issues or contamination",
            "Inspect motor windings and electrical connections",
          ],
        })
      }

      setFaults(newFaults)

      // Generate maintenance recommendations based on faults
      const newRecommendations = newFaults.map((fault) => ({
        id: fault.id,
        component: fault.component,
        severity: fault.severity,
        action: fault.recommendations[0],
        deadline: fault.severity === "critical" ? "Immediate" : "Within 48 hours",
        impact: fault.severity === "critical" ? "High" : "Medium",
        location: fault.location,
      }))

      setRecommendations(newRecommendations)

      // Collect all sensor types from all industries
      const allSensors = []
      Object.values(industryData).forEach((industry) => {
        industry.leakTypes.forEach((leakType) => {
          leakType.sensors.forEach((sensor) => {
            if (!allSensors.find((s) => s.type === sensor)) {
              allSensors.push({
                type: sensor,
                industry: industry.title,
                leakType: leakType.title,
              })
            }
          })
        })
      })

      // Generate sensor health data
      const sensorData = allSensors.map((sensor) => {
        const data = generateSensorTimeSeriesData(sensor.type)
        return {
          ...sensor,
          status: data.status,
          currentValue: data.currentValue,
          unit: data.unit,
          warningThreshold: data.warningThreshold,
          faultThreshold: data.faultThreshold,
          health:
            data.status === "Normal"
              ? Math.floor(Math.random() * 30) + 70
              : data.status === "Warning"
                ? Math.floor(Math.random() * 30) + 40
                : Math.floor(Math.random() * 30) + 10,
        }
      })

      setSensorHealthData(sensorData)
    }
  }, [user])

  // Add a function to filter sensor data by industry
  const filterSensorsByIndustry = (sensors) => {
    if (user?.role !== "operator") return sensors

    const selectedIndustryData = localStorage.getItem("selectedIndustry")
    if (!selectedIndustryData) return sensors

    const industry = JSON.parse(selectedIndustryData)
    return sensors.filter((sensor) => sensor.industry === industry.title)
  }

  if (!user || !predictiveData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  // Helper function to get color based on health percentage
  const getHealthColor = (health) => {
    if (health < 30) return "bg-red-500"
    if (health < 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Helper function to get text color based on health percentage
  const getHealthTextColor = (health) => {
    if (health < 30) return "text-red-500"
    if (health < 60) return "text-yellow-500"
    return "text-green-500"
  }

  // Helper function to get icon based on component type
  const getComponentIcon = (component) => {
    switch (component.toLowerCase()) {
      case "temperature":
        return <Thermometer className="h-6 w-6 text-red-500" />
      case "vibration":
        return <Vibrate className="h-6 w-6 text-blue-500" />
      case "sound":
        return <Volume2 className="h-6 w-6 text-purple-500" />
      case "load":
        return <Weight className="h-6 w-6 text-yellow-500" />
      default:
        return <Activity className="h-6 w-6 text-gray-500" />
    }
  }

  // Helper function to get icon based on sensor type
  const getSensorIcon = (sensorType) => {
    switch (sensorType.toLowerCase()) {
      case "temperature sensor":
        return <Thermometer className="h-5 w-5 text-red-500" />
      case "pressure sensor":
        return <Gauge className="h-5 w-5 text-blue-500" />
      case "acoustic sensor":
        return <Ear className="h-5 w-5 text-purple-500" />
      case "vibration sensor":
        return <Vibrate className="h-5 w-5 text-orange-500" />
      case "mq-135 sensor":
        return <Radio className="h-5 w-5 text-green-500" />
      case "ir flame sensor":
        return <Flame className="h-5 w-5 text-red-500" />
      case "fuel & oil sensing cable":
      case "fuel cable":
      case "fuel sensor":
        return <Fuel className="h-5 w-5 text-yellow-500" />
      case "water-in-oil sensor":
        return <Droplet className="h-5 w-5 text-blue-500" />
      case "capacitive fuel sensor":
      case "ultrasonic fuel level sensor":
        return <Gauge className="h-5 w-5 text-yellow-500" />
      case "soil moisture sensor":
        return <Droplet className="h-5 w-5 text-amber-700" />
      case "humidity sensor":
        return <Droplet className="h-5 w-5 text-teal-500" />
      case "power sensor":
        return <Activity className="h-5 w-5 text-yellow-500" />
      case "ultrasonic sensor":
        return <Volume2 className="h-5 w-5 text-cyan-500" />
      case "load sensor":
        return <Weight className="h-5 w-5 text-blue-500" />
      default:
        return <Radio className="h-5 w-5 text-gray-500" />
    }
  }

  // Helper function to get a random calibration date
  const getRandomCalibrationDate = () => {
    const today = new Date()
    const daysAgo = Math.floor(Math.random() * 180) + 1 // Random number between 1-180 days
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    return date.toLocaleDateString()
  }

  // Helper function to get usage description based on sensor type and industry
  const getUsageDescription = (sensorType, industry) => {
    switch (sensorType.toLowerCase()) {
      case "temperature sensor":
        return `Monitors heat levels in ${industry} equipment to prevent overheating and ensure optimal operation.`
      case "pressure sensor":
        return `Measures fluid or gas pressure in ${industry} pipelines and vessels to detect leaks and prevent failures.`
      case "acoustic sensor":
        return `Detects sound patterns in ${industry} systems to identify leaks, valve issues, or mechanical problems.`
      case "vibration sensor":
        return `Monitors vibration levels in ${industry} machinery to detect imbalance, misalignment, or bearing failures.`
      case "mq-135 sensor":
        return `Detects air quality and gas leaks in ${industry} environments to ensure safety and compliance.`
      case "ir flame sensor":
        return `Identifies flames or heat sources in ${industry} operations to prevent fires and ensure safety protocols.`
      case "fuel & oil sensing cable":
      case "fuel cable":
      case "fuel sensor":
        return `Detects fuel or oil leaks in ${industry} storage and transport systems to prevent environmental damage.`
      case "water-in-oil sensor":
        return `Monitors water contamination in oil systems used in ${industry} to maintain equipment integrity.`
      case "capacitive fuel sensor":
      case "ultrasonic fuel level sensor":
        return `Measures fuel levels in ${industry} storage tanks and equipment to prevent shortages and detect leaks.`
      case "soil moisture sensor":
        return `Monitors ground moisture levels around ${industry} installations to detect underground leaks.`
      case "humidity sensor":
        return `Measures atmospheric moisture in ${industry} environments to ensure optimal operating conditions.`
      case "power sensor":
        return `Monitors electrical consumption and anomalies in ${industry} equipment to optimize energy use.`
      case "ultrasonic sensor":
        return `Uses sound waves to detect structural issues or leaks in ${industry} systems without direct contact.`
      case "load sensor":
        return `Measures weight and force in ${industry} equipment to prevent overloading and structural failures.`
      default:
        return `Used in ${industry} operations for monitoring and leak detection.`
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64 overflow-x-hidden">
        <Header title="Predictive Maintenance" />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Dashboard Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">PREDICTIVE MAINTENANCE DASHBOARD</h1>
            <p className="text-slate-400 text-center">AI-powered anomaly detection and early fault prediction</p>
          </div>

          {/* Top Cards - RUL only now */}
          <div className="mb-4">
            {/* Remaining Useful Life */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-cyan-500 text-white p-3">
                <h2 className="font-bold">Remaining Useful Life</h2>
              </div>
              <div className="p-3 bg-white flex flex-col items-center justify-center h-[200px]">
                <div className="text-6xl md:text-8xl font-bold text-gray-800 mb-2">{predictiveData.remainingDays}</div>
                <div className="text-xl text-gray-800">days</div>

                <div className="mt-4 text-center">
                  <p className="text-red-600 font-medium text-lg">Maintenance required soon!</p>
                  <p className="text-gray-600 mt-1">Estimated RUL: {predictiveData.remainingHours} hours</p>
                </div>

                <div className="mt-2 text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Sensor Health Status - New Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="bg-blue-500 text-white p-3">
              <h2 className="font-bold">Sensor Health Status</h2>
            </div>
            <div className="p-3 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filterSensorsByIndustry(sensorHealthData).map((sensor, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <div
                      className={`p-2 ${
                        sensor.status === "Fault"
                          ? "bg-red-500"
                          : sensor.status === "Warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      } text-white`}
                    >
                      <div className="flex items-center">
                        {getSensorIcon(sensor.type)}
                        <h3 className="ml-2 font-medium text-sm truncate">{sensor.type}</h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Health</span>
                        <span
                          className={`text-xs font-medium ${
                            sensor.health < 30
                              ? "text-red-500"
                              : sensor.health < 60
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          {sensor.health}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${
                            sensor.health < 30 ? "bg-red-500" : sensor.health < 60 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${sensor.health}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Current</span>
                        <span className="font-medium text-gray-800">
                          {sensor.currentValue} {sensor.unit}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Threshold</span>
                        <span className="font-medium text-gray-800">
                          {sensor.faultThreshold} {sensor.unit}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{sensor.industry}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              sensor.status === "Fault"
                                ? "bg-red-100 text-red-800"
                                : sensor.status === "Warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {sensor.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="bg-red-500 text-white p-3">
              <h2 className="font-bold">Anomaly Detection</h2>
            </div>
            <div className="p-3 bg-white">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictiveData.anomalyHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#6b7280" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e5e7eb",
                        color: "#111827",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#ef4444"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                      name="Anomaly Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Early Fault Detection */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="bg-yellow-500 text-white p-3">
              <h2 className="font-bold">Early Fault Detection</h2>
            </div>
            <div className="p-3 bg-white">
              {faults.length > 0 ? (
                <div className="space-y-3">
                  {faults.map((fault) => (
                    <div
                      key={fault.id}
                      className={`border-l-4 ${
                        fault.severity === "critical" ? "border-red-500" : "border-yellow-500"
                      } p-3 bg-gray-50 rounded-r-md`}
                    >
                      <div className="flex items-start flex-wrap">
                        <div className="mr-2">
                          <AlertTriangle
                            className={`h-5 w-5 ${fault.severity === "critical" ? "text-red-500" : "text-yellow-500"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {fault.component}: {fault.message}
                          </h3>
                          <p className="text-gray-600 mt-1 text-xs">Location: {fault.location}</p>
                          <p className="text-gray-600 text-xs">Readings: {fault.readings}</p>
                          <p className="text-gray-600 text-xs">Detected: {fault.timestamp}</p>

                          <div className="mt-1">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              onClick={() => {
                                // Toggle expanded view logic would go here
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium mt-1 sm:mt-0 ${
                            fault.severity === "critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {fault.severity.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-gray-800 text-lg">No early faults detected at this time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Recommendations */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="bg-gray-900 text-white p-3">
              <h2 className="font-bold">Maintenance Recommendations</h2>
            </div>
            <div className="p-3 bg-white">
              {recommendations.length > 0 ? (
                <div className="overflow-x-auto -mx-3">
                  <div className="inline-block min-w-full align-middle p-3">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Component
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Impact
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recommendations.map((rec) => (
                          <tr key={rec.id}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="font-medium text-gray-900 text-xs">{rec.component}</div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-gray-900 text-xs">{rec.action}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div
                                className={`text-xs ${
                                  rec.deadline === "Immediate" ? "text-red-600" : "text-yellow-600"
                                } font-medium`}
                              >
                                {rec.deadline}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  rec.impact === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {rec.impact}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{rec.location}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-2">Schedule</button>
                              <button className="text-green-600 hover:text-green-900">Complete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-gray-800 text-lg">No maintenance actions required at this time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Component Health Status - Updated with all sensors and descriptions */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white p-3">
              <h2 className="font-bold">Component Health Status</h2>
            </div>
            <div className="p-3 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filterSensorsByIndustry(sensorHealthData).map((sensor, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <div
                      className={`p-2 ${
                        sensor.status === "Fault"
                          ? "bg-red-500"
                          : sensor.status === "Warning"
                            ? "bg-yellow-500"
                            : "bg-green-600"
                      } text-white`}
                    >
                      <div className="flex items-center">
                        {getSensorIcon(sensor.type)}
                        <h3 className="ml-2 font-medium text-sm">{sensor.type}</h3>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col">
                      <div className="relative w-full h-20 mb-2 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-800">{sensor.health}%</span>
                        </div>
                        <svg className="w-20 h-20" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
                          />
                          <path
                            d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={sensor.health < 30 ? "#ef4444" : sensor.health < 60 ? "#f59e0b" : "#10b981"}
                            strokeWidth="3"
                            strokeDasharray={`${sensor.health}, 100`}
                          />
                        </svg>
                      </div>

                      <div className="text-xs text-gray-600 mb-2 text-center">
                        <span className="font-medium">Current:</span> {sensor.currentValue} {sensor.unit} |
                        <span className="font-medium ml-1">Threshold:</span> {sensor.faultThreshold} {sensor.unit}
                      </div>

                      <div className="bg-gray-100 p-2 rounded-md mt-1">
                        <p className="text-xs text-gray-800">
                          <span className="font-medium">Used in:</span> {sensor.industry}
                        </p>
                        <p className="text-xs text-gray-800 mt-1">
                          <span className="font-medium">Monitors:</span> {sensor.leakType}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {getUsageDescription(sensor.type, sensor.industry)}
                        </p>
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Last calibrated: {getRandomCalibrationDate()}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            sensor.status === "Fault"
                              ? "bg-red-100 text-red-800"
                              : sensor.status === "Warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {sensor.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
