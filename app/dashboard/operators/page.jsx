"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Search, Eye, EyeOff, CheckCircle, Trash2, Edit2, UserCheck, UserX } from "lucide-react"

import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import BackButton from "../../../components/back-button"

export default function OperatorsManagement() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [operators, setOperators] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "operator",
    department: "",
    status: "active",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // Check if user is authenticated and is admin
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    // Load operators from localStorage
    const storedOperators = localStorage.getItem("operators")
    if (storedOperators) {
      setOperators(JSON.parse(storedOperators))
    } else {
      // Mock operators data for initial setup
      const mockOperators = [
        {
          id: 1,
          email: "john.smith@leakagemonitoring.com",
          name: "John Smith",
          role: "operator",
          department: "Field Operations",
          status: "active",
          lastLogin: "2023-07-28 09:45:12",
          password: "password123", // In a real app, this would be hashed
        },
        {
          id: 2,
          email: "sarah.johnson@leakagemonitoring.com",
          name: "Sarah Johnson",
          role: "operator",
          department: "Monitoring",
          status: "active",
          lastLogin: "2023-07-27 14:22:05",
          password: "password123",
        },
        {
          id: 3,
          email: "michael.brown@leakagemonitoring.com",
          name: "Michael Brown",
          role: "operator",
          department: "Maintenance",
          status: "inactive",
          lastLogin: "2023-07-15 11:30:45",
          password: "password123",
        },
      ]
      setOperators(mockOperators)
      localStorage.setItem("operators", JSON.stringify(mockOperators))
    }
  }, [router])

  // Filter operators based on search query
  const filteredOperators = operators.filter(
    (operator) =>
      operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"

    if (!formData.name) errors.name = "Name is required"
    if (!formData.department) errors.department = "Department is required"

    // Add password validation
    if (!selectedOperator && !formData.password) errors.password = "Password is required"
    else if (!selectedOperator && formData.password.length < 8)
      errors.password = "Password must be at least 8 characters"

    // Check if email already exists (for new operators)
    if (!selectedOperator && operators.some((op) => op.email === formData.email)) {
      errors.email = "An operator with this email already exists"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (selectedOperator) {
      // Update existing operator
      const updatedOperators = operators.map((op) =>
        op.id === selectedOperator.id
          ? {
              ...op,
              name: formData.name,
              email: formData.email,
              department: formData.department,
              status: formData.status,
              ...(formData.password ? { password: formData.password } : {}),
            }
          : op,
      )
      setOperators(updatedOperators)
      localStorage.setItem("operators", JSON.stringify(updatedOperators))
      setSuccessMessage(`Operator ${formData.name} updated successfully!`)
    } else {
      // Add new operator
      const newOperator = {
        id: Date.now(),
        ...formData,
        lastLogin: "Never",
      }

      const updatedOperators = [...operators, newOperator]
      setOperators(updatedOperators)
      localStorage.setItem("operators", JSON.stringify(updatedOperators))
      setSuccessMessage(`Operator ${formData.name} added successfully!`)
    }

    // Reset form
    setFormData({
      email: "",
      name: "",
      role: "operator",
      department: "",
      status: "active",
      password: "",
    })
    setSelectedOperator(null)
    setShowAddModal(false)

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Handle operator deletion
  const handleDeleteOperator = (id) => {
    if (window.confirm("Are you sure you want to delete this operator?")) {
      const updatedOperators = operators.filter((operator) => operator.id !== id)
      setOperators(updatedOperators)
      localStorage.setItem("operators", JSON.stringify(updatedOperators))
      setSuccessMessage("Operator deleted successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }
  }

  // Handle operator status toggle
  const handleToggleStatus = (id) => {
    const updatedOperators = operators.map((operator) =>
      operator.id === id ? { ...operator, status: operator.status === "active" ? "inactive" : "active" } : operator,
    )
    setOperators(updatedOperators)
    localStorage.setItem("operators", JSON.stringify(updatedOperators))
    setSuccessMessage("Operator status updated successfully!")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  if (!user || user.role !== "admin") {
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
        <Header title="Operators Management" />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Operators</h2>
              <p className="text-slate-400">Manage system operators and their access</p>
            </div>

            <button
              onClick={() => {
                setFormData({
                  email: "",
                  name: "",
                  role: "operator",
                  department: "",
                  status: "active",
                  password: "",
                })
                setFormErrors({})
                setSelectedOperator(null)
                setShowAddModal(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Operator
            </button>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}

          {/* Search */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search operators by name, email, or department..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Operators table */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Department
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
                      Last Login
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
                  {filteredOperators.length > 0 ? (
                    filteredOperators.map((operator) => (
                      <tr key={operator.id} className="hover:bg-slate-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{operator.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{operator.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{operator.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              operator.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {operator.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{operator.lastLogin}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleToggleStatus(operator.id)}
                            className={`inline-flex items-center ${
                              operator.status === "active"
                                ? "text-red-500 hover:text-red-400"
                                : "text-green-500 hover:text-green-400"
                            } mr-3`}
                            title={operator.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {operator.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" /> Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" /> Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOperator(operator)
                              setFormData({
                                email: operator.email,
                                name: operator.name,
                                role: operator.role,
                                department: operator.department,
                                status: operator.status,
                                password: "", // Don't show the password in the form
                              })
                              setFormErrors({})
                              setShowAddModal(true)
                            }}
                            className="inline-flex items-center text-blue-500 hover:text-blue-400 mr-3"
                          >
                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOperator(operator.id)}
                            className="inline-flex items-center text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-slate-400">
                        No operators found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{selectedOperator ? "Edit Operator" : "Add New Operator"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                      Email Address*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`w-full px-4 py-2 bg-slate-700 border ${
                        formErrors.email ? "border-red-500" : "border-slate-600"
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      placeholder="operator@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                      Full Name*
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className={`w-full px-4 py-2 bg-slate-700 border ${
                        formErrors.name ? "border-red-500" : "border-slate-600"
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">
                      Department*
                    </label>
                    <select
                      id="department"
                      name="department"
                      required
                      className={`w-full px-4 py-2 bg-slate-700 border ${
                        formErrors.department ? "border-red-500" : "border-slate-600"
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Department</option>
                      <option value="Field Operations">Field Operations</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Safety">Safety</option>
                      <option value="Quality Control">Quality Control</option>
                    </select>
                    {formErrors.department && <p className="mt-1 text-sm text-red-500">{formErrors.department}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                      {selectedOperator ? "Password (leave blank to keep current)" : "Password*"}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required={!selectedOperator}
                        className={`w-full px-4 py-2 bg-slate-700 border ${
                          formErrors.password ? "border-red-500" : "border-slate-600"
                        } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                        placeholder={
                          selectedOperator
                            ? "Leave blank to keep current password"
                            : "Enter password (min 8 characters)"
                        }
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedOperator
                        ? "Leave blank to keep the current password."
                        : "Password must be at least 8 characters long."}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 transition-colors"
                  >
                    {selectedOperator ? "Update Operator" : "Add Operator"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
