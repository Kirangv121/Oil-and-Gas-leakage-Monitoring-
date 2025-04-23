"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, RefreshCw, Sun, Bell, Shield, Database } from "lucide-react"

import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import BackButton from "../../../components/back-button"

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Settings state
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      sms: false,
      criticalAlertsOnly: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipRestriction: false,
    },
    display: {
      dataRefreshRate: 30,
      showRealTimeUpdates: true,
      compactView: false,
    },
    system: {
      backupFrequency: "daily",
      dataRetention: 90,
      maintenanceWindow: "sunday",
    },
  })

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem("settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [router])

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Save settings to localStorage
      localStorage.setItem("settings", JSON.stringify(settings))

      setLoading(false)
      setSuccessMessage("Settings saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }, 1000)
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
        <Header title="Settings" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">System Settings</h2>
              <p className="text-slate-400">Configure your system preferences and options</p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appearance Settings */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                  <Sun className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-xl font-medium">Appearance</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-yellow-500"
                        name="theme"
                        value="light"
                        checked={settings.theme === "light"}
                        onChange={() => handleChange("theme", "", "light")}
                      />
                      <span className="ml-2 text-sm">Light</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-yellow-500"
                        name="theme"
                        value="dark"
                        checked={settings.theme === "dark"}
                        onChange={() => handleChange("theme", "", "dark")}
                      />
                      <span className="ml-2 text-sm">Dark</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-yellow-500"
                        name="theme"
                        value="system"
                        checked={settings.theme === "system"}
                        onChange={() => handleChange("theme", "", "system")}
                      />
                      <span className="ml-2 text-sm">System</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Display Options</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.display.showRealTimeUpdates}
                        onChange={(e) => handleChange("display", "showRealTimeUpdates", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Show real-time updates</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.display.compactView}
                        onChange={(e) => handleChange("display", "compactView", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Use compact view</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data Refresh Rate (seconds)</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={settings.display.dataRefreshRate}
                    onChange={(e) => handleChange("display", "dataRefreshRate", Number.parseInt(e.target.value))}
                  >
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium">Notifications</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notification Channels</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.notifications.email}
                        onChange={(e) => handleChange("notifications", "email", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Email notifications</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.notifications.push}
                        onChange={(e) => handleChange("notifications", "push", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Push notifications</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.notifications.sms}
                        onChange={(e) => handleChange("notifications", "sms", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">SMS notifications</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.notifications.criticalAlertsOnly}
                        onChange={(e) => handleChange("notifications", "criticalAlertsOnly", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Critical alerts only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-2 rounded-full mr-3">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xl font-medium">Security</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Authentication</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleChange("security", "twoFactorAuth", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Enable two-factor authentication</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-yellow-500"
                        checked={settings.security.ipRestriction}
                        onChange={(e) => handleChange("security", "ipRestriction", e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Enable IP restriction</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Session Timeout (minutes)</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="bg-red-500/20 p-2 rounded-full mr-3">
                  <Database className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-xl font-medium">System</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data Backup Frequency</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={settings.system.backupFrequency}
                    onChange={(e) => handleChange("system", "backupFrequency", e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data Retention Period (days)</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={settings.system.dataRetention}
                    onChange={(e) => handleChange("system", "dataRetention", Number.parseInt(e.target.value))}
                  >
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>365 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Maintenance Window</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={settings.system.maintenanceWindow}
                    onChange={(e) => handleChange("system", "maintenanceWindow", e.target.value)}
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
