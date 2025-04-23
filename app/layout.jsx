import "./globals.css"

export const metadata = {
  title: "Leakage Monitoring - Remote Monitoring & Predictive Maintenance Dashboard",
  description: "AI-Powered Remote Monitoring & Predictive Maintenance for High-Risk Industries",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
