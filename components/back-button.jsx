"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-slate-300 hover:text-white transition-colors"
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      <span>Back</span>
    </button>
  )
}
