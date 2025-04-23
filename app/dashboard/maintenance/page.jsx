"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, Filter, Download, Search, DollarSign, TrendingDown, Wrench, FileText } from "lucide-react"

import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import BackButton from "../../../components/back-button"

export default function MaintenanceHistory() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

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

    // Generate mock maintenance records
    const mockRecords = [
      {
        id: 1,
        equipment: "Pressure Sensor #A123",
        type: "Calibration",
        status: "completed",
        date: "2023-05-15",
        technician: "John Smith",
        notes: "Routine calibration performed. Sensor accuracy within acceptable range.",
        location: "Pipeline Section A, Valve Cluster 5",
        industry: "Oil & Gas",
        cost: 450,
        savings: 2800,
        downtime: "2 hours",
        parts: [
          { name: "Calibration Kit", cost: 150 },
          { name: "Sensor Gasket", cost: 50 },
        ],
        labor: { hours: 2, rate: 125, cost: 250 },
      },
      {
        id: 2,
        equipment: "Temperature Sensor #T456",
        type: "Replacement",
        status: "completed",
        date: "2023-06-22",
        technician: "Sarah Johnson",
        notes: "Sensor replaced due to drift in readings. Old sensor sent for analysis.",
        location: "Pump Station 3, Unit B",
        industry: "Oil & Gas",
        cost: 600,
        savings: 3500,
        downtime: "4 hours",
        parts: [
          { name: "Temperature Sensor", cost: 350 },
          { name: "Mounting Bracket", cost: 75 },
          { name: "Thermal Paste", cost: 25 },
        ],
        labor: { hours: 1.5, rate: 100, cost: 150 },
      },
      {
        id: 3,
        equipment: "Vibration Sensor #V789",
        type: "Repair",
        status: "completed",
        date: "2023-07-10",
        technician: "Mike Davis",
        notes: "Repaired loose connection. Tested functionality and confirmed normal operation.",
        location: "Compressor Station 2",
        industry: "Oil & Gas",
        cost: 300,
        savings: 1500,
        downtime: "1 hour",
        parts: [
          { name: "Connection Terminal", cost: 75 },
          { name: "Sealant", cost: 25 },
        ],
        labor: { hours: 2, rate: 100, cost: 200 },
      },
      {
        id: 4,
        equipment: "Acoustic Sensor #AC234",
        type: "Inspection",
        status: "scheduled",
        date: "2023-08-05",
        technician: "Lisa Chen",
        notes: "Scheduled inspection due to intermittent readings.",
        location: "Pipeline Junction B7",
        industry: "Oil & Gas",
        cost: 200,
        savings: 1000,
        downtime: "0 hours",
        parts: [],
        labor: { hours: 2, rate: 100, cost: 200 },
      },
      {
        id: 5,
        equipment: "MQ-135 Gas Sensor #G567",
        type: "Calibration",
        status: "in-progress",
        date: "2023-07-28",
        technician: "Robert Wilson",
        notes: "Calibration in progress due to sensitivity drift.",
        location: "Storage Tank Area, Section C",
        industry: "Oil & Gas",
        cost: 500,
        savings: 2000,
        downtime: "2 hours",
        parts: [
          { name: "Calibration Kit", cost: 200 },
          { name: "Reference Gas", cost: 150 },
        ],
        labor: { hours: 1.5, rate: 100, cost: 150 },
      },
      {
        id: 6,
        equipment: "Fuel Sensor #F890",
        type: "Replacement",
        status: "scheduled",
        date: "2023-08-15",
        technician: "Amanda Lee",
        notes: "Scheduled replacement due to end of service life.",
        location: "Fuel Storage Facility, Tank 3",
        industry: "Transportation & Logistics",
        cost: 700,
        savings: 4000,
        downtime: "6 hours",
        parts: [
          { name: "Fuel Level Sensor", cost: 450 },
          { name: "Wiring Harness", cost: 100 },
        ],
        labor: { hours: 1.5, rate: 100, cost: 150 },
      },
      {
        id: 7,
        equipment: "IR Flame Sensor #IF345",
        type: "Emergency Repair",
        status: "completed",
        date: "2023-07-05",
        technician: "David Brown",
        notes: "Emergency repair after lightning strike. Sensor fully functional after replacement.",
        location: "Refinery Section D, Processing Unit 2",
        industry: "Oil & Gas",
        cost: 1200,
        savings: 6000,
        downtime: "12 hours",
        parts: [
          { name: "IR Flame Sensor", cost: 750 },
          { name: "Control Module", cost: 250 },
        ],
        labor: { hours: 2, rate: 100, cost: 200 },
      },
      {
        id: 8,
        equipment: "Pressure Sensor #A456",
        type: "Firmware Update",
        status: "completed",
        date: "2023-06-30",
        technician: "James Wilson",
        notes: "Updated firmware to version 3.2.1 to improve accuracy and response time.",
        location: "Pipeline Section B, Monitoring Station 4",
        industry: "Oil & Gas",
        cost: 150,
        savings: 750,
        downtime: "0.5 hours",
        parts: [],
        labor: { hours: 1.5, rate: 100, cost: 150 },
      },
      {
        id: 9,
        equipment: "Soil Moisture Sensor #SM123",
        type: "Calibration",
        status: "completed",
        date: "2023-07-12",
        technician: "Emily Parker",
        notes: "Calibrated sensor for seasonal soil conditions. Adjusted sensitivity parameters.",
        location: "Field Section A, Irrigation Zone 2",
        industry: "Agriculture (AgriTech)",
        cost: 400,
        savings: 2200,
        downtime: "3 hours",
        parts: [
          { name: "Calibration Kit", cost: 200 },
          { name: "Moisture Reference", cost: 50 },
        ],
        labor: { hours: 1.5, rate: 100, cost: 150 },
      },
      {
        id: 10,
        equipment: "Vibration Sensor #V456",
        type: "Inspection",
        status: "scheduled",
        date: "2023-08-10",
        technician: "Michael Thompson",
        notes: "Scheduled inspection for landing gear monitoring system.",
        location: "Hangar 3, Bay 5",
        industry: "Aerospace & Defense",
        cost: 250,
        savings: 1200,
        downtime: "1 hours",
        parts: [],
        labor: { hours: 2.5, rate: 100, cost: 250 },
      },
      {
        id: 11,
        equipment: "Load Sensor #L789",
        type: "Replacement",
        status: "completed",
        date: "2023-07-08",
        technician: "Jessica Adams",
        notes: "Replaced load sensor on crane system. Calibrated and tested under load.",
        location: "Construction Site B, Tower Crane 2",
        industry: "Construction",
        cost: 800,
        savings: 4500,
        downtime: "5 hours",
        parts: [
          { name: "Load Cell", cost: 550 },
          { name: "Mounting Hardware", cost: 100 },
        ],
        labor: { hours: 1.5, rate: 100, cost: 150 },
      },
    ]

    setMaintenanceRecords(mockRecords)
  }, [router])

  // Add a function to filter maintenance records by industry
  const filterRecordsByIndustry = (records) => {
    if (user?.role !== "operator") return records

    const selectedIndustryData = localStorage.getItem("selectedIndustry")
    if (!selectedIndustryData) return records

    const industry = JSON.parse(selectedIndustryData)

    // Map industry IDs to titles for comparison
    const industryMap = {
      "oil-gas": "Oil & Gas",
      transportation: "Transportation & Logistics",
      agriculture: "Agriculture (AgriTech)",
      aerospace: "Aerospace & Defense",
      construction: "Construction",
    }

    return records.filter((record) => record.industry === industryMap[industry.id])
  }

  // Filter and search records
  const filteredRecords = filterRecordsByIndustry(maintenanceRecords).filter((record) => {
    const matchesStatus = filterStatus === "all" || record.status === filterStatus
    const matchesSearch =
      record.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // Calculate totals
  const totalCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0)
  const totalSavings = filteredRecords.reduce((sum, record) => sum + record.savings, 0)
  const completedRecords = filteredRecords.filter((record) => record.status === "completed")
  const averageDowntime =
    completedRecords.length > 0
      ? completedRecords.reduce((sum, record) => sum + Number.parseFloat(record.downtime), 0) / completedRecords.length
      : 0

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        )
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </span>
        )
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-slate-900 text-white flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full lg:ml-64 bg-slate-900">
        <Header title="Maintenance History" />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Maintenance Records</h2>
              <p className="text-slate-400">View and manage maintenance history for all equipment</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center px-3 py-1.5 bg-slate-800 rounded-md text-sm hover:bg-slate-700 transition-colors">
                <Filter className="h-4 w-4 mr-1" />
                Advanced Filter
              </button>
              <button className="inline-flex items-center px-3 py-1.5 bg-slate-800 rounded-md text-sm hover:bg-slate-700 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button className="inline-flex items-center px-3 py-1.5 bg-slate-800 rounded-md text-sm hover:bg-slate-700 transition-colors">
                <FileText className="h-4 w-4 mr-1" />
                Generate Report
              </button>
            </div>
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
                        <p className="text-sm text-slate-400">Viewing maintenance records for {industry.title} only</p>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Search and filter */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by equipment, technician, or location..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterStatus === "all" ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterStatus === "completed" ? "bg-green-500 text-white" : "bg-slate-700 text-white"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilterStatus("in-progress")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterStatus === "in-progress" ? "bg-blue-500 text-white" : "bg-slate-700 text-white"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilterStatus("scheduled")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterStatus === "scheduled" ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-white"
                  }`}
                >
                  Scheduled
                </button>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Maintenance Cost</p>
                  <h3 className="text-2xl font-bold">${totalCost.toLocaleString()}</h3>
                  <p className="text-yellow-500 text-sm">↑ 5% from last quarter</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <TrendingDown className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Cost Savings</p>
                  <h3 className="text-2xl font-bold">${totalSavings.toLocaleString()}</h3>
                  <p className="text-green-500 text-sm">↑ 12% from last quarter</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                  <Wrench className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Preventive Maintenance</p>
                  <h3 className="text-2xl font-bold">78%</h3>
                  <p className="text-green-500 text-sm">↑ 8% from last quarter</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center">
                <div className="bg-red-500/20 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Avg. Downtime</p>
                  <h3 className="text-2xl font-bold">{averageDowntime.toFixed(1)} hours</h3>
                  <p className="text-green-500 text-sm">↓ 15% from last quarter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance records */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Equipment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Technician
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Cost
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Savings
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Downtime
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{record.equipment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{record.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{record.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{record.technician}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">${record.cost}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-500">${record.savings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{record.downtime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-yellow-500 hover:text-yellow-400 mr-3"
                            onClick={() => {
                              setSelectedRecord(record)
                              setShowDetailModal(true)
                            }}
                          >
                            View
                          </button>
                          <button className="text-blue-500 hover:text-blue-400">Edit</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-4 text-center text-slate-400">
                        No maintenance records found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Maintenance Record Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedRecord.equipment}</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white">
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-400">Type</p>
                  <p className="text-white">{selectedRecord.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <div>{getStatusBadge(selectedRecord.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-white">{selectedRecord.date}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Technician</p>
                  <p className="text-white">{selectedRecord.technician}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-white">{selectedRecord.location}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Industry</p>
                  <p className="text-white">{selectedRecord.industry}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-1">Notes</p>
                <p className="text-white bg-slate-700 p-3 rounded-md">{selectedRecord.notes}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700 p-4 rounded-md">
                  <p className="text-sm text-slate-400 mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-white">${selectedRecord.cost}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-md">
                  <p className="text-sm text-slate-400 mb-1">Estimated Savings</p>
                  <p className="text-2xl font-bold text-green-500">${selectedRecord.savings}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-md">
                  <p className="text-sm text-slate-400 mb-1">Downtime</p>
                  <p className="text-2xl font-bold text-white">{selectedRecord.downtime}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Parts Used</h4>
                {selectedRecord.parts.length > 0 ? (
                  <table className="min-w-full divide-y divide-slate-700 border border-slate-700 rounded-md overflow-hidden">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">Part Name</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-300">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selectedRecord.parts.map((part, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-white">{part.name}</td>
                          <td className="px-4 py-2 text-sm text-white text-right">${part.cost}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-750">
                        <td className="px-4 py-2 text-sm font-medium text-white">Total Parts Cost</td>
                        <td className="px-4 py-2 text-sm font-medium text-white text-right">
                          ${selectedRecord.parts.reduce((sum, part) => sum + part.cost, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-400 italic">No parts used for this maintenance.</p>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Labor</h4>
                <table className="min-w-full divide-y divide-slate-700 border border-slate-700 rounded-md overflow-hidden">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">Hours</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">Rate</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-300">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-sm text-white">{selectedRecord.labor.hours}</td>
                      <td className="px-4 py-2 text-sm text-white">${selectedRecord.labor.rate}/hr</td>
                      <td className="px-4 py-2 text-sm text-white text-right">${selectedRecord.labor.cost}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
