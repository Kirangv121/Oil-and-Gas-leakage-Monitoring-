"use client"
import { ArrowRight } from "lucide-react"

export default function IndustryCard({ title, description, icon: Icon, imageUrl, onClick }) {
  return (
    <div
      className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-yellow-500 transition-colors group cursor-pointer"
      onClick={onClick}
    >
      <div className="h-40 bg-slate-700 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            {Icon && <Icon className="h-16 w-16 text-yellow-500 opacity-50" />}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 mb-4">{description}</p>
        <div className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
