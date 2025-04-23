"use client"

import { useState, useEffect } from "react"
import { Bell, Search } from "lucide-react"

export default function Header({ title }) {
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock notifications
    setNotifications([
      { id: 1, message: "Pressure threshold exceeded on Pump #3", time: "10 min ago", isRead: false },
      { id: 2, message: "Maintenance scheduled for Pipeline B", time: "1 hour ago", isRead: false },
      { id: 3, message: "System update completed successfully", time: "3 hours ago", isRead: true },
    ])
  }, [])

  return (
    <header className="bg-slate-800 border-b border-slate-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-slate-700 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-6 w-6 text-slate-300" />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-slate-700">
                  <h3 className="font-medium text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-slate-700 hover:bg-slate-700 transition-colors ${
                            notification.isRead ? "opacity-70" : ""
                          }`}
                        >
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-slate-400">No notifications</div>
                  )}
                </div>
                <div className="p-2 border-t border-slate-700">
                  <button className="w-full text-center text-sm text-yellow-400 hover:underline p-1">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          {user && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-white hidden md:block">{user.email.split("@")[0]}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
