"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

import Sidebar from "../../../../components/sidebar"
import Header from "../../../../components/header"
import BackButton from "../../../../components/back-button"
import LeakTypeCard from "../../../../components/leak-type-card"
import { industryData } from "../../../../lib/industry-data"

export default function IndustryDetail() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [industry, setIndustry] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Get industry data
    const industrySlug = params.industry
    if (industryData[industrySlug]) {
      setIndustry({
        slug: industrySlug,
        ...industryData[industrySlug],
      })
    } else {
      router.push("/dashboard")
    }
  }, [router, params])

  if (!user || !industry) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  // Assign random statuses to leak types for demonstration
  const statuses = ["normal", "warning", "fault"]
  const leakTypesWithStatus = industry.leakTypes.map((leakType) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    return { ...leakType, status: randomStatus }
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header title={industry.title} />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{industry.title}</h2>
            <p className="text-slate-400">{industry.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Common Leak Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leakTypesWithStatus.map((leakType, index) => (
                <LeakTypeCard key={index} industry={industry.slug} leakType={leakType} status={leakType.status} />
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-medium mb-4">Sensor Network Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Active Sensors</span>
                  <span className="text-green-500 font-medium">42</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Maintenance Required</span>
                  <span className="text-yellow-500 font-medium">7</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Offline Sensors</span>
                  <span className="text-red-500 font-medium">3</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
