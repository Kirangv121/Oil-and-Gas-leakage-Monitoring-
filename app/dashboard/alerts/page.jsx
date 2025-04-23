"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCircle } from "lucide-react"

import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import AlertCard from "../../../components/alert-card"
import { dashboardData } from "../../../lib/data"
// Add import for BackButton
import BackButton from "../../../components/back-button"

export default function Alerts() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState("all")

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
    }

    setAlerts(dashboardData.alerts)

    // Simulate real-time alerts
    const interval = setInterval(() => {
      // 10% chance of new alert
      if (Math.random() < 0.1) {
        const newAlert = {
          id: Date.now(),
          title: "New Alert",
          message: "This is a simulated real-time alert",
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
          time: "Just now",
          status: "active",
          location: "Simulated Location",
          assetId: `SIM-${Math.floor(Math.random() * 1000)}`,
          recommendations: ["This is a simulated alert for demonstration purposes", "No action is required"],
          industry: [
            "Oil & Gas",
            "Transportation & Logistics",
            "Agriculture (AgriTech)",
            "Aerospace & Defense",
            "Construction",
          ][Math.floor(Math.random() * 5)],
        }

        setAlerts((prev) => [newAlert, ...prev])
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [router])

  // Add a function to filter alerts by industry
  const filterAlertsByIndustry = (alerts) => {
    if (user?.role !== "operator") return alerts

    const selectedIndustryData = localStorage.getItem("selectedIndustry")
    if (!selectedIndustryData) return alerts

    const industry = JSON.parse(selectedIndustryData)

    // Map industry IDs to titles for comparison
    const industryMap = {
      "oil-gas": "Oil & Gas",
      transportation: "Transportation & Logistics",
      agriculture: "Agriculture (AgriTech)",
      aerospace: "Aerospace & Defense",
      construction: "Construction",
    }

    return alerts.filter((alert) => !alert.industry || alert.industry === industryMap[industry.id])
  }

  // Then use this function when filtering alerts
  // Modify the filteredAlerts definition:
  const filteredAlerts = filterAlertsByIndustry(alerts).filter((alert) => {
    if (filter === "all") return true
    if (filter === "active") return alert.status === "active"
    if (filter === "acknowledged") return alert.status === "acknowledged"
    if (filter === "resolved") return alert.status === "resolved"
    if (filter === "critical") return alert.severity === "critical"
    if (filter === "high") return alert.severity === "high"
    return true
  })

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
        <Header title="Alerts & Notifications" />

        {/* Add the back button to the main content section, right after the opening <main> tag */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          {user?.role === "operator" && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                {(() => {
                  const selectedIndustryData = localStorage.getItem("selectedIndustry")
                  if (!selectedIndustryData) return null

                  const industry = JSON.parse(selectedIndustryData)
                  return (
                    <>
                      <span className="text-2xl mr-2">{industry.icon}</span>
                      <div>
                        <h3 className="font-medium text-white">{industry.title}</h3>
                        <p className="text-sm text-slate-400">Viewing alerts for {industry.title} only</p>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">System Alerts</h2>
              <p className="text-slate-400">Monitor and respond to system alerts and notifications</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "all" ? "bg-yellow-500 text-slate-900" : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "active" ? "bg-yellow-500 text-slate-900" : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("acknowledged")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "acknowledged"
                    ? "bg-yellow-500 text-slate-900"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                Acknowledged
              </button>
              <button
                onClick={() => setFilter("resolved")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "resolved" ? "bg-yellow-500 text-slate-900" : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                Resolved
              </button>
              <button
                onClick={() => setFilter("critical")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "critical" ? "bg-red-500 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                Critical
              </button>
            </div>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Alerts</p>
                  <h3 className="text-2xl font-bold">{alerts.length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-red-500/20 p-3 rounded-full mr-4">
                  <Bell className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Active Alerts</p>
                  <h3 className="text-2xl font-bold">{alerts.filter((a) => a.status === "active").length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                  <Bell className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Acknowledged</p>
                  <h3 className="text-2xl font-bold">{alerts.filter((a) => a.status === "acknowledged").length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Resolved</p>
                  <h3 className="text-2xl font-bold">{alerts.filter((a) => a.status === "resolved").length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Alert List */}
          <div>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
                <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No alerts found</h3>
                <p className="text-slate-400">There are no alerts matching your current filter criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
