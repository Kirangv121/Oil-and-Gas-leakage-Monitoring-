"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSignUp = searchParams.get("signup") === "true"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "operator", // Default role
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)

      if (formData.role === "operator") {
        // Get operators from localStorage
        const storedOperators = localStorage.getItem("operators")
        if (!storedOperators) {
          setError("No operators found. Please contact your administrator.")
          return
        }

        const operators = JSON.parse(storedOperators)
        const operator = operators.find(
          (op) => op.email === formData.email && op.password === formData.password && op.status === "active",
        )

        if (!operator) {
          setError("Invalid email or password, or your account may be inactive.")
          return
        }

        // Update operator's last login time
        const updatedOperators = operators.map((op) =>
          op.id === operator.id
            ? {
                ...op,
                lastLogin: new Date().toLocaleString(),
              }
            : op,
        )
        localStorage.setItem("operators", JSON.stringify(updatedOperators))

        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: operator.id,
            email: operator.email,
            name: operator.name,
            role: "operator",
            department: operator.department,
            isAuthenticated: true,
          }),
        )

        router.push("/industry-selection")
      } else if (formData.role === "admin") {
        // For demo purposes, hardcode admin credentials
        if (formData.email === "admin@leakagemonitoring.com" && formData.password === "admin123") {
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: formData.email,
              role: "admin",
              isAuthenticated: true,
            }),
          )
          router.push("/dashboard")
        } else {
          setError("Invalid admin credentials.")
        }
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-500 p-3 rounded-full">
              <Zap className="h-8 w-8 text-slate-900" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-6">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === "operator" && (
                <div className="mt-1 text-xs text-yellow-500">
                  Note: Operator accounts must be created by an administrator before login.
                </div>
              )}

              {formData.role === "admin" && (
                <div className="mt-1 text-xs text-yellow-500">
                  Demo admin credentials: admin@leakagemonitoring.com / admin123
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-yellow-500 text-slate-900 rounded-md font-medium hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900 mr-2"></div>
                      Processing...
                    </div>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-yellow-400 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <Link href={isSignUp ? "/login" : "/login?signup=true"} className="ml-1 text-yellow-400 hover:underline">
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
