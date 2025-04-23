"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BarChart2, TrendingUp, PieChartIcon, Calendar, Download } from "lucide-react"

import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import BackButton from "../../../components/back-button"

export default function Analytics() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [timeRange, setTimeRange] = useState("yearly")
  const [activeTab, setActiveTab] = useState("overview")

  // Add state for selected industry
  const [selectedIndustry, setSelectedIndustry] = useState(null)

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

      // Set the selected industry in state if needed
      const industry = JSON.parse(selectedIndustryData)
      setSelectedIndustry(industry)
    }
  }, [router])

  // Mock data for charts
  const yearlyData = [
    { name: "Jan", incidents: 5, maintenance: 12, efficiency: 87 },
    { name: "Feb", incidents: 3, maintenance: 8, efficiency: 89 },
    { name: "Mar", incidents: 7, maintenance: 15, efficiency: 85 },
    { name: "Apr", incidents: 2, maintenance: 10, efficiency: 92 },
    { name: "May", incidents: 4, maintenance: 9, efficiency: 90 },
    { name: "Jun", incidents: 6, maintenance: 14, efficiency: 86 },
    { name: "Jul", incidents: 3, maintenance: 11, efficiency: 91 },
    { name: "Aug", incidents: 5, maintenance: 13, efficiency: 88 },
    { name: "Sep", incidents: 2, maintenance: 7, efficiency: 93 },
    { name: "Oct", incidents: 4, maintenance: 10, efficiency: 89 },
    { name: "Nov", incidents: 3, maintenance: 9, efficiency: 90 },
    { name: "Dec", incidents: 5, maintenance: 12, efficiency: 87 },
  ]

  const sensorTypeData = [
    { name: "Temperature", value: 25 },
    { name: "Pressure", value: 30 },
    { name: "Acoustic", value: 15 },
    { name: "Vibration", value: 20 },
    { name: "Gas", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  const incidentsByIndustry = [
    { name: "Oil & Gas", value: 45 },
    { name: "Transportation", value: 25 },
    { name: "Agriculture", value: 15 },
    { name: "Aerospace", value: 10 },
    { name: "Construction", value: 5 },
  ]

  const predictiveAccuracyData = [
    { name: "Jan", accuracy: 85 },
    { name: "Feb", accuracy: 87 },
    { name: "Mar", accuracy: 86 },
    { name: "Apr", accuracy: 89 },
    { name: "May", accuracy: 91 },
    { name: "Jun", accuracy: 90 },
    { name: "Jul", accuracy: 92 },
    { name: "Aug", accuracy: 94 },
    { name: "Sep", accuracy: 93 },
    { name: "Oct", accuracy: 95 },
    { name: "Nov", accuracy: 94 },
    { name: "Dec", accuracy: 96 },
  ]

  const getIncidentsByIndustry = () => {
    if (user?.role !== "operator" || !selectedIndustry) {
      return incidentsByIndustry
    }

    // Map industry IDs to titles for comparison
    const industryMap = {
      "oil-gas": "Oil & Gas",
      transportation: "Transportation & Logistics",
      agriculture: "Agriculture (AgriTech)",
      aerospace: "Aerospace & Defense",
      construction: "Construction",
    }

    // Filter to only show the selected industry
    return incidentsByIndustry.filter((item) => item.name === industryMap[selectedIndustry.id])
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header title="Analytics Dashboard" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
              <p className="text-slate-400">Comprehensive data analysis and insights</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex bg-slate-800 rounded-md overflow-hidden">
                <button
                  onClick={() => setTimeRange("monthly")}
                  className={`px-3 py-1.5 text-sm ${
                    timeRange === "monthly" ? "bg-yellow-500 text-slate-900" : "text-slate-300"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeRange("quarterly")}
                  className={`px-3 py-1.5 text-sm ${
                    timeRange === "quarterly" ? "bg-yellow-500 text-slate-900" : "text-slate-300"
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setTimeRange("yearly")}
                  className={`px-3 py-1.5 text-sm ${
                    timeRange === "yearly" ? "bg-yellow-500 text-slate-900" : "text-slate-300"
                  }`}
                >
                  Yearly
                </button>
              </div>
              <button className="inline-flex items-center px-3 py-1.5 bg-slate-800 rounded-md text-sm hover:bg-slate-700 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>

          {user?.role === "operator" && selectedIndustry && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{selectedIndustry.icon}</span>
                <div>
                  <h3 className="font-medium text-white">{selectedIndustry.title}</h3>
                  <p className="text-sm text-slate-400">Viewing analytics for {selectedIndustry.title} only</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-slate-800 rounded-lg p-1 mb-6 flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "overview" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("incidents")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "incidents" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Incident Analysis
            </button>
            <button
              onClick={() => setActiveTab("sensors")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "sensors" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Sensor Performance
            </button>
            <button
              onClick={() => setActiveTab("predictive")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "predictive" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Predictive Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                      <BarChart2 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Incidents</p>
                      <h3 className="text-2xl font-bold">49</h3>
                      <p className="text-green-500 text-sm">↓ 12% from last year</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-green-500/20 p-3 rounded-full mr-4">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">System Efficiency</p>
                      <h3 className="text-2xl font-bold">89.2%</h3>
                      <p className="text-green-500 text-sm">↑ 3.5% from last year</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                      <Calendar className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Maintenance Events</p>
                      <h3 className="text-2xl font-bold">130</h3>
                      <p className="text-yellow-500 text-sm">↑ 5% from last year</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                      <PieChartIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Prediction Accuracy</p>
                      <h3 className="text-2xl font-bold">94%</h3>
                      <p className="text-green-500 text-sm">↑ 2.1% from last year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yearly Trends Chart */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-medium mb-4">Yearly Trends</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          borderColor: "#475569",
                          color: "#f8fafc",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="maintenance" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-lg font-medium mb-4">Sensor Type Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sensorTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {sensorTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#475569",
                            color: "#f8fafc",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-lg font-medium mb-4">Incidents by Industry</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getIncidentsByIndustry()}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#475569",
                            color: "#f8fafc",
                          }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === "incidents" && (
            <div className="bg-slate-800 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium mb-4">Incident Analysis</h3>
              <p className="text-slate-400">Detailed incident analysis and trends coming soon.</p>
            </div>
          )}

          {activeTab === "sensors" && (
            <div className="bg-slate-800 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium mb-4">Sensor Performance</h3>
              <p className="text-slate-400">Detailed sensor performance metrics coming soon.</p>
            </div>
          )}

          {activeTab === "predictive" && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-4">Predictive Analytics Accuracy</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictiveAccuracyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[80, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderColor: "#475569",
                        color: "#f8fafc",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 bg-slate-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">AI Model Performance</h4>
                <p className="text-slate-300 text-sm mb-2">
                  Our predictive maintenance AI model has shown consistent improvement in accuracy over the past year,
                  reaching 96% accuracy in failure prediction. The model has been particularly effective in predicting
                  equipment failures 7-14 days before they occur, allowing for proactive maintenance scheduling.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">False Positives</p>
                    <p className="text-xl font-bold text-yellow-500">3.2%</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">False Negatives</p>
                    <p className="text-xl font-bold text-red-500">0.8%</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Avg. Lead Time</p>
                    <p className="text-xl font-bold text-green-500">9.3 days</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
