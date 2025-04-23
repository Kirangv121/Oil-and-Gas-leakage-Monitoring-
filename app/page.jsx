import Link from "next/link"
import { ArrowRight, Shield, BarChart2, Activity, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-yellow-400 mr-2" />
          <h1 className="text-2xl font-bold">Leakage Monitoring</h1>
        </div>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-transparent border border-white hover:bg-white hover:text-slate-900 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/login?signup=true"
            className="px-4 py-2 rounded-md bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Banner */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Remote Monitoring & Predictive Maintenance
            <span className="block text-yellow-400 mt-2">for High-Risk Industries</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Prevent costly downtime, enhance safety, and optimize operations with our cutting-edge monitoring platform.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 rounded-md bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors text-lg font-medium"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>

        {/* Features Section */}
        <section className="bg-slate-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-700 p-6 rounded-lg">
                <div className="bg-yellow-500 p-3 rounded-full w-fit mb-4">
                  <Activity className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-Time Monitoring</h3>
                <p className="text-slate-300">
                  Monitor critical infrastructure in real-time with advanced sensors and IoT integration.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <div className="bg-yellow-500 p-3 rounded-full w-fit mb-4">
                  <BarChart2 className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold mb-3">Predictive Analytics</h3>
                <p className="text-slate-300">
                  Leverage AI/ML algorithms to predict equipment failures before they occur.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <div className="bg-yellow-500 p-3 rounded-full w-fit mb-4">
                  <Shield className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enhanced Safety</h3>
                <p className="text-slate-300">
                  Improve workplace safety with automated alerts and incident prevention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Applications */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Industry Applications</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Oil & Gas", description: "Monitor pipelines, refineries, and offshore platforms." },
                { name: "Transportation & Logistics", description: "Track fleet performance and maintenance needs." },
                { name: "Agriculture (AgriTech)", description: "Monitor irrigation systems and equipment health." },
                { name: "Aerospace & Defense", description: "Ensure critical systems reliability and safety." },
                { name: "Construction", description: "Monitor heavy equipment and prevent costly downtime." },
                { name: "Manufacturing", description: "Optimize production lines and prevent failures." },
              ].map((industry, index) => (
                <div key={index} className="bg-slate-700 p-6 rounded-lg hover:bg-slate-600 transition-colors">
                  <h3 className="text-xl font-bold mb-3">{industry.name}</h3>
                  <p className="text-slate-300 mb-4">{industry.description}</p>
                  <Link href="/login" className="text-yellow-400 inline-flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Safety Benefits */}
        <section className="bg-slate-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Security & Safety Benefits</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Enterprise-Grade Security</h3>
                <p className="text-slate-300">
                  End-to-end encryption, role-based access control, and compliance with industry standards.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Incident Prevention</h3>
                <p className="text-slate-300">
                  Proactive alerts and automated shutdown procedures to prevent accidents.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Regulatory Compliance</h3>
                <p className="text-slate-300">Automated reporting and documentation to meet regulatory requirements.</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Risk Mitigation</h3>
                <p className="text-slate-300">
                  Identify and address potential risks before they become critical issues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Operations?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              Join industry leaders who trust our platform to protect their assets and optimize performance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-3 rounded-md bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors text-lg font-medium"
              >
                Login
              </Link>
              <Link
                href="/login?signup=true"
                className="px-6 py-3 rounded-md bg-transparent border border-white hover:bg-white hover:text-slate-900 transition-colors text-lg font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Zap className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="text-xl font-bold">Leakage Monitoring</span>
            </div>
            <div className="text-slate-400">© {new Date().getFullYear()} Leakage Monitoring. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
