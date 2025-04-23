// Generate time series data for sensor graphs
export function generateSensorTimeSeriesData(sensorType, points = 24) {
  // Use a simple hash function to create a seed from the sensor type
  const seed = sensorType.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const data = []
  const now = new Date()

  // Set base values and variations based on sensor type
  let baseValue, variation, unit, warningThreshold, faultThreshold

  switch (sensorType.toLowerCase()) {
    case "temperature sensor":
      baseValue = 65
      variation = 15
      unit = "°C"
      warningThreshold = 85
      faultThreshold = 95
      break
    case "pressure sensor":
      baseValue = 75
      variation = 25
      unit = "psi"
      warningThreshold = 120
      faultThreshold = 150
      break
    case "acoustic sensor":
      baseValue = 60
      variation = 20
      unit = "dB"
      warningThreshold = 85
      faultThreshold = 95
      break
    case "vibration sensor":
      baseValue = 450
      variation = 150
      unit = "Hz"
      warningThreshold = 650
      faultThreshold = 750
      break
    case "mq-135 sensor":
      baseValue = 35
      variation = 15
      unit = "ppm"
      warningThreshold = 60
      faultThreshold = 80
      break
    case "ir flame sensor":
      baseValue = 0.4
      variation = 0.3
      unit = "V"
      warningThreshold = 0.8
      faultThreshold = 1.0
      break
    case "fuel sensor":
    case "fuel cable":
    case "fuel & oil sensing cable":
      baseValue = 45
      variation = 15
      unit = "%"
      warningThreshold = 70
      faultThreshold = 85
      break
    case "water-in-oil sensor":
      baseValue = 0.05
      variation = 0.03
      unit = "%"
      warningThreshold = 0.1
      faultThreshold = 0.15
      break
    case "soil moisture sensor":
      baseValue = 35
      variation = 10
      unit = "%"
      warningThreshold = 60
      faultThreshold = 75
      break
    case "humidity sensor":
      baseValue = 45
      variation = 15
      unit = "%"
      warningThreshold = 70
      faultThreshold = 85
      break
    case "power sensor":
      baseValue = 220
      variation = 20
      unit = "V"
      warningThreshold = 250
      faultThreshold = 270
      break
    case "ultrasonic sensor":
    case "ultrasonic fuel level sensor":
      baseValue = 50
      variation = 20
      unit = "cm"
      warningThreshold = 80
      faultThreshold = 90
      break
    case "load sensor":
      baseValue = 5
      variation = 3
      unit = "kg"
      warningThreshold = 8
      faultThreshold = 10
      break
    case "capacitive fuel sensor":
      baseValue = 50
      variation = 15
      unit = "%"
      warningThreshold = 75
      faultThreshold = 90
      break
    default:
      baseValue = 50
      variation = 20
      unit = "units"
      warningThreshold = 80
      faultThreshold = 90
  }

  // Generate data points with timestamps using the seed for deterministic randomness
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now)
    time.setMinutes(now.getMinutes() - i * 5) // 5-minute intervals

    // Create some patterns in the data using the seed and index for deterministic randomness
    let value
    // Use a more stable way to generate pseudo-random numbers
    const pseudoRandom = Math.abs(Math.sin(seed * (i + 1))) // Value between 0 and 1

    if (i % 8 === 0) {
      // Create occasional spikes or dips
      value = baseValue + (pseudoRandom > 0.5 ? 1 : -1) * variation * 1.5
    } else if (i % 3 === 0) {
      // Create some moderate variations
      value = baseValue + (pseudoRandom - 0.5) * variation
    } else {
      // Normal variations
      value = baseValue + (pseudoRandom - 0.5) * variation * 0.5
    }

    // Ensure value is positive
    value = Math.max(0, value)

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: value,
      timestamp: time.getTime(),
    })
  }

  // Get the current value from the last data point
  const currentValue = data[data.length - 1].value.toFixed(1)

  // Determine status based on the current value
  let status = "Normal"
  if (Number.parseFloat(currentValue) > faultThreshold) {
    status = "Fault"
  } else if (Number.parseFloat(currentValue) > warningThreshold) {
    status = "Warning"
  }

  return {
    data,
    unit,
    warningThreshold,
    faultThreshold,
    currentValue,
    status,
  }
}

// Generate operating info - make this deterministic based on sensor type
export function generateOperatingInfo() {
  const now = new Date()

  // Fixed values to avoid re-renders
  const hours = 876
  const minutes = 45

  return {
    operatingHours: `${hours}h ${minutes}m`,
    lastUpdated: now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }
}
