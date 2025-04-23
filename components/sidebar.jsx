"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  AlertTriangle,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  BarChart2,
  Users,
  History,
  RefreshCw,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // If user is an operator, check for selected industry
      if (parsedUser.role === "operator") {
        const selectedIndustryData = localStorage.getItem("selectedIndustry")
        if (selectedIndustryData) {
          const industry = JSON.parse(selectedIndustryData)
          // You could set this to state if needed
        }
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Predictive Maintenance",
      href: "/dashboard/predictive-maintenance",
      icon: Activity,
    },
    {
      name: "Alerts",
      href: "/dashboard/alerts",
      icon: AlertTriangle,
    },
    {
      name: "Maintenance History",
      href: "/dashboard/maintenance",
      icon: History,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
    },
    {
      name: "Change Industry",
      href: "/industry-selection",
      icon: RefreshCw,
      operatorOnly: true,
    },
    {
      name: "Operators",
      href: "/dashboard/operators",
      icon: Users,
      adminOnly: true,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      adminOnly: true,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-slate-800 text-white hover:bg-slate-700"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center p-4 border-b border-slate-800">
            <Zap className="h-8 w-8 text-yellow-400 mr-2" />
            <h1 className="text-xl font-bold">Leakage Monitoring</h1>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                // Skip admin-only items for non-admin users
                if (item.adminOnly && user?.role !== "admin") {
                  return null
                }

                // Skip operator-only items for non-operator users
                if (item.operatorOnly && user?.role !== "operator") {
                  return null
                }

                const isActive = pathname === item.href

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive ? "bg-yellow-500 text-slate-900" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
