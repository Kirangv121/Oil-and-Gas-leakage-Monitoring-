"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, BarChart2, Droplet, Thermometer } from "lucide-react"

import Sidebar from "../../components/sidebar"
import Header from "../../components/header"
import LineChartComponent from "../../components/charts/line-chart"
import BarChartComponent from "../../components/charts/bar-chart"
import GaugeChart from "../../components/charts/gauge-chart"
import IndustryCard from "../../components/industry-card"
import { dashboardData } from "../../lib/data"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showIndustryCards, setShowIndustryCards] = useState(true)
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

      const industry = JSON.parse(selectedIndustryData)
      setSelectedIndustry(industry)
      setShowIndustryCards(false)
    }
  }, [router])

  const handleIndustrySelect = (industry) => {
    // Map industry title to slug
    const slugMap = {
      "Oil & Gas": "oil-gas",
      "Transportation & Logistics": "transportation",
      "Agriculture (AgriTech)": "agriculture",
      "Aerospace & Defense": "aerospace",
      Construction: "construction",
    }

    const slug = slugMap[industry.title]
    if (slug) {
      router.push(`/dashboard/industry/${slug}`)
    } else {
      setSelectedIndustry(industry)
      setShowIndustryCards(false)
    }
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
        <Header title="Dashboard" />

        <main className="flex-1 p-6">
          {user?.role === "operator" && selectedIndustry ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedIndustry.title} Dashboard</h2>
                  <p className="text-slate-400">Monitoring and analytics for {selectedIndustry.title}</p>
                </div>
                <div className="flex items-center bg-slate-800 px-3 py-2 rounded-md">
                  <span className="text-2xl mr-2">{selectedIndustry.icon}</span>
                  <span className="text-sm text-slate-300">Selected Industry</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                      <Droplet className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Production</p>
                      <h3 className="text-2xl font-bold">5,240 bbl/day</h3>
                      <p className="text-green-500 text-sm">↑ 3.2% from yesterday</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                      <Thermometer className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Avg. Temperature</p>
                      <h3 className="text-2xl font-bold">65.8°C</h3>
                      <p className="text-red-500 text-sm">↑ 1.5°C from normal</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-green-500/20 p-3 rounded-full mr-4">
                      <Activity className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">System Uptime</p>
                      <h3 className="text-2xl font-bold">99.8%</h3>
                      <p className="text-green-500 text-sm">↑ 0.3% from last month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                      <BarChart2 className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Efficiency</p>
                      <h3 className="text-2xl font-bold">87.2%</h3>
                      <p className="text-yellow-500 text-sm">↓ 0.5% from target</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <LineChartComponent
                  title="Oil Production (bbl/day)"
                  data={dashboardData.oilProduction.map((item) => ({
                    time: item.time,
                    production: item.value,
                    target: item.target,
                  }))}
                  dataKeys={["production", "target"]}
                  colors={["#3b82f6", "#94a3b8"]}
                  syncId="dashboard"
                />

                <LineChartComponent
                  title="Pump Pressure (PSI)"
                  data={dashboardData.pumpPressure}
                  dataKeys={["pressure", "threshold"]}
                  colors={["#f59e0b", "#ef4444"]}
                  syncId="dashboard"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <GaugeChart
                  title="Overall System Health"
                  value={87}
                  min={0}
                  max={100}
                  thresholds={[
                    { value: 50, color: "#ef4444" },
                    { value: 75, color: "#f59e0b" },
                    { value: 100, color: "#10b981" },
                  ]}
                  unit="%"
                />

                <GaugeChart
                  title="Pipeline Pressure"
                  value={72}
                  min={0}
                  max={100}
                  thresholds={[
                    { value: 30, color: "#ef4444" },
                    { value: 60, color: "#10b981" },
                    { value: 85, color: "#f59e0b" },
                    { value: 100, color: "#ef4444" },
                  ]}
                  unit=" PSI"
                />

                <GaugeChart
                  title="Storage Capacity"
                  value={65}
                  min={0}
                  max={100}
                  thresholds={[
                    { value: 90, color: "#10b981" },
                    { value: 95, color: "#f59e0b" },
                    { value: 100, color: "#ef4444" },
                  ]}
                  unit="%"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChartComponent
                  title="Equipment Efficiency (%)"
                  data={dashboardData.equipmentEfficiency}
                  dataKeys={["efficiency", "target"]}
                  colors={["#10b981", "#94a3b8"]}
                />

                <LineChartComponent
                  title="Equipment Temperature (°C)"
                  data={dashboardData.equipmentTemperature}
                  dataKeys={["temperature", "ambient"]}
                  colors={["#ef4444", "#3b82f6"]}
                />
              </div>
            </>
          ) : (
            // Original content for admin users
            <>
              {showIndustryCards ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Select Industry</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.industries.map((industry, index) => (
                      <IndustryCard
                        key={index}
                        title={industry.title}
                        description={industry.description}
                        imageUrl={industry.imageUrl}
                        onClick={() => handleIndustrySelect(industry)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{selectedIndustry.title} Dashboard</h2>
                    <button
                      onClick={() => setShowIndustryCards(true)}
                      className="px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                    >
                      Change Industry
                    </button>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                          <Droplet className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Production</p>
                          <h3 className="text-2xl font-bold">5,240 bbl/day</h3>
                          <p className="text-green-500 text-sm">↑ 3.2% from yesterday</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center">
                        <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                          <Thermometer className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Avg. Temperature</p>
                          <h3 className="text-2xl font-bold">65.8°C</h3>
                          <p className="text-red-500 text-sm">↑ 1.5°C from normal</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center">
                        <div className="bg-green-500/20 p-3 rounded-full mr-4">
                          <Activity className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">System Uptime</p>
                          <h3 className="text-2xl font-bold">99.8%</h3>
                          <p className="text-green-500 text-sm">↑ 0.3% from last month</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center">
                        <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                          <BarChart2 className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Efficiency</p>
                          <h3 className="text-2xl font-bold">87.2%</h3>
                          <p className="text-yellow-500 text-sm">↓ 0.5% from target</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <LineChartComponent
                      title="Oil Production (bbl/day)"
                      data={dashboardData.oilProduction.map((item) => ({
                        time: item.time,
                        production: item.value,
                        target: item.target,
                      }))}
                      dataKeys={["production", "target"]}
                      colors={["#3b82f6", "#94a3b8"]}
                      syncId="dashboard"
                    />

                    <LineChartComponent
                      title="Pump Pressure (PSI)"
                      data={dashboardData.pumpPressure}
                      dataKeys={["pressure", "threshold"]}
                      colors={["#f59e0b", "#ef4444"]}
                      syncId="dashboard"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <GaugeChart
                      title="Overall System Health"
                      value={87}
                      min={0}
                      max={100}
                      thresholds={[
                        { value: 50, color: "#ef4444" },
                        { value: 75, color: "#f59e0b" },
                        { value: 100, color: "#10b981" },
                      ]}
                      unit="%"
                    />

                    <GaugeChart
                      title="Pipeline Pressure"
                      value={72}
                      min={0}
                      max={100}
                      thresholds={[
                        { value: 30, color: "#ef4444" },
                        { value: 60, color: "#10b981" },
                        { value: 85, color: "#f59e0b" },
                        { value: 100, color: "#ef4444" },
                      ]}
                      unit=" PSI"
                    />

                    <GaugeChart
                      title="Storage Capacity"
                      value={65}
                      min={0}
                      max={100}
                      thresholds={[
                        { value: 90, color: "#10b981" },
                        { value: 95, color: "#f59e0b" },
                        { value: 100, color: "#ef4444" },
                      ]}
                      unit="%"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChartComponent
                      title="Equipment Efficiency (%)"
                      data={dashboardData.equipmentEfficiency}
                      dataKeys={["efficiency", "target"]}
                      colors={["#10b981", "#94a3b8"]}
                    />

                    <LineChartComponent
                      title="Equipment Temperature (°C)"
                      data={dashboardData.equipmentTemperature}
                      dataKeys={["temperature", "ambient"]}
                      colors={["#ef4444", "#3b82f6"]}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
