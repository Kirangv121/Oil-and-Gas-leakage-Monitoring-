"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Zap, ArrowRight } from "lucide-react"

export default function IndustrySelectionPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and is an operator
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // If user is not an operator, redirect to dashboard
    if (parsedUser.role !== "operator") {
      router.push("/dashboard")
    }

    // Check if industry is already selected
    const selectedIndustryData = localStorage.getItem("selectedIndustry")
    if (selectedIndustryData) {
      router.push("/dashboard")
    }
  }, [router])

  const industries = [
    {
      id: "oil-gas",
      title: "Oil & Gas",
      icon: "🛢️",
      description: "Monitor pipelines, refineries, and offshore platforms.",
    },
    {
      id: "transportation",
      title: "Transportation & Logistics",
      icon: "🚚",
      description: "Track fleet performance and maintenance needs.",
    },
    {
      id: "agriculture",
      title: "Agriculture (AgriTech)",
      icon: "🌾",
      description: "Monitor irrigation systems and equipment health.",
    },
    {
      id: "aerospace",
      title: "Aerospace & Defense",
      icon: "✈️",
      description: "Ensure critical systems reliability and safety.",
    },
    {
      id: "construction",
      title: "Construction",
      icon: "🚧",
      description: "Monitor heavy equipment and prevent costly downtime.",
    },
  ]

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry)
  }

  const handleContinue = () => {
    if (!selectedIndustry) return

    setIsLoading(true)

    // Store selected industry in localStorage
    localStorage.setItem("selectedIndustry", JSON.stringify(selectedIndustry))

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-yellow-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">Leakage Monitoring</h1>
        </div>
        <div>
          <span className="text-slate-300">
            Welcome, <span className="text-white font-medium">{user.email}</span>
          </span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Select Your Industry</h1>
          <p className="text-slate-300 text-center mb-8">
            Please select the industry you are responsible for monitoring:
          </p>

          <div className="grid gap-4">
            {industries.map((industry) => (
              <button
                key={industry.id}
                className={`bg-slate-800 border-2 ${
                  selectedIndustry?.id === industry.id ? "border-yellow-500" : "border-slate-700"
                } rounded-lg p-4 text-left hover:border-yellow-500 transition-colors flex items-center`}
                onClick={() => handleIndustrySelect(industry)}
              >
                <div className="text-4xl mr-4">{industry.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{industry.title}</h3>
                  <p className="text-slate-400">{industry.description}</p>
                </div>
                {selectedIndustry?.id === industry.id && (
                  <div className="bg-yellow-500 text-slate-900 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedIndustry || isLoading}
              className="inline-flex items-center px-6 py-3 rounded-md bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Dashboard
              {isLoading ? (
                <div className="ml-2 h-5 w-5 border-t-2 border-b-2 border-slate-900 rounded-full animate-spin"></div>
              ) : (
                <ArrowRight className="ml-2 h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
