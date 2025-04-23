// Generate predictive maintenance data
export function generatePredictiveData() {
  // Create a deterministic seed for consistent data generation
  const seed = 12345

  // Generate health history data (last 20 days)
  const healthHistory = []
  const now = new Date()

  for (let i = 19; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate a health score with some variation but trending downward
    // Use a sine wave pattern with a downward trend
    const baseHealth = 75 - i * 0.5 // Slight downward trend
    const variation = Math.sin(seed + i) * 15 // Variation based on sine wave

    healthHistory.push({
      time: date.toLocaleDateString(),
      health: Math.max(20, Math.min(95, baseHealth + variation)),
    })
  }

  // Generate anomaly history data (last 10 time periods)
  const anomalyHistory = []

  for (let i = 9; i >= 0; i--) {
    const time = new Date()
    time.setHours(time.getHours() - i)

    // Generate anomaly scores with increasing trend
    const baseAnomaly = 40 + (9 - i) * 3 // Increasing trend
    const variation = Math.sin(seed + i * 2) * 20 // Variation based on sine wave

    anomalyHistory.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      score: Math.max(10, Math.min(95, baseAnomaly + variation)),
    })
  }

  // Component health data
  const components = {
    temperature: {
      health: 21, // Critical
      current: 92,
      threshold: 85,
      unit: "°C",
    },
    vibration: {
      health: 97, // Good
      current: 450,
      threshold: 650,
      unit: "Hz",
    },
    sound: {
      health: 83, // Good
      current: 65,
      threshold: 85,
      unit: "dB",
    },
    load: {
      health: 57, // Warning
      current: 78,
      threshold: 90,
      unit: "%",
    },
  }

  // Calculate remaining useful life based on component health
  // Find the lowest component health
  const lowestHealth = Math.min(...Object.values(components).map((c) => c.health))

  // Calculate RUL - lower health means less remaining life
  const remainingDays = Math.max(1, Math.floor(lowestHealth / 20))
  const remainingHours = Math.max(1, Math.floor(lowestHealth / 5))

  return {
    healthHistory,
    anomalyHistory,
    components,
    remainingDays,
    remainingHours,
  }
}
