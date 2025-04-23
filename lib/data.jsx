// Mock data for the dashboard

// Generate time series data
export function generateTimeSeriesData(points = 24, baseValue = 50, variance = 20) {
  const data = []
  const now = new Date()

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: Math.max(0, baseValue + (Math.random() - 0.5) * variance * 2),
    })
  }

  return data
}

// Dashboard data
export const dashboardData = {
  // Oil & Gas specific metrics
  oilProduction: generateTimeSeriesData(24, 5000, 500).map((item) => ({
    ...item,
    value: Math.round(item.value),
    target: 5000,
  })),

  pumpPressure: generateTimeSeriesData(24, 75, 15).map((item) => ({
    ...item,
    pressure: item.value,
    threshold: 90,
  })),

  equipmentTemperature: generateTimeSeriesData(24, 65, 10).map((item) => ({
    ...item,
    temperature: item.value,
    ambient: item.value - 15 - Math.random() * 5,
  })),

  pipelineFlow: generateTimeSeriesData(24, 800, 100).map((item) => ({
    ...item,
    flow: item.value,
    expected: 800,
  })),

  // Equipment efficiency
  equipmentEfficiency: [
    { name: "Pump A", efficiency: 87, target: 90 },
    { name: "Pump B", efficiency: 92, target: 90 },
    { name: "Compressor", efficiency: 78, target: 85 },
    { name: "Separator", efficiency: 95, target: 90 },
    { name: "Heat Exchanger", efficiency: 89, target: 85 },
  ],

  // Maintenance data
  maintenanceSchedule: [
    { id: 1, equipment: "Pump Station #3", date: "2023-06-15", status: "scheduled", priority: "high" },
    { id: 2, equipment: "Pipeline Section B", date: "2023-06-18", status: "scheduled", priority: "medium" },
    { id: 3, equipment: "Storage Tank #7", date: "2023-06-22", status: "scheduled", priority: "low" },
    { id: 4, equipment: "Compressor Unit", date: "2023-06-10", status: "completed", priority: "high" },
    { id: 5, equipment: "Valve Assembly", date: "2023-06-05", status: "completed", priority: "medium" },
  ],

  // Alerts
  alerts: [
    {
      id: 1,
      title: "High Pressure Alert",
      message: "Pressure exceeding threshold in Pipeline Section A",
      severity: "high",
      time: "10 minutes ago",
      status: "active",
      location: "Pipeline Section A",
      assetId: "PIPE-A-123",
      recommendations: ["Reduce flow rate by 15%", "Check pressure relief valve", "Inspect for blockages"],
    },
    {
      id: 2,
      title: "Temperature Warning",
      message: "Compressor temperature rising above normal operating range",
      severity: "medium",
      time: "45 minutes ago",
      status: "active",
      location: "Compressor Station 2",
      assetId: "COMP-2-456",
      recommendations: ["Check cooling system", "Inspect lubrication system", "Schedule maintenance if persists"],
    },
    {
      id: 3,
      title: "Pump Vibration",
      message: "Abnormal vibration detected in Pump Unit #5",
      severity: "critical",
      time: "2 hours ago",
      status: "acknowledged",
      location: "Pump Station 3",
      assetId: "PUMP-5-789",
      recommendations: [
        "Shut down pump immediately",
        "Inspect bearings and shaft alignment",
        "Prepare replacement parts",
      ],
    },
    {
      id: 4,
      title: "Flow Rate Deviation",
      message: "Flow rate below expected threshold in Transfer Line C",
      severity: "low",
      time: "3 hours ago",
      status: "resolved",
      location: "Transfer Line C",
      assetId: "LINE-C-012",
      recommendations: ["Check valve positions", "Inspect for partial blockage", "Verify sensor calibration"],
    },
  ],

  // Predictive maintenance
  predictiveMaintenance: {
    equipmentHealth: [
      { name: "Pump A", health: 87, risk: "low", nextMaintenance: "45 days" },
      { name: "Pump B", health: 72, risk: "medium", nextMaintenance: "15 days" },
      { name: "Compressor", health: 58, risk: "high", nextMaintenance: "5 days" },
      { name: "Separator", health: 91, risk: "low", nextMaintenance: "60 days" },
      { name: "Heat Exchanger", health: 65, risk: "medium", nextMaintenance: "20 days" },
    ],

    failurePredictions: [
      {
        equipment: "Compressor Unit #2",
        probability: 68,
        estimatedTimeToFailure: "12 days",
        components: [
          { name: "Bearing Assembly", health: 45 },
          { name: "Shaft Seal", health: 62 },
          { name: "Intake Filter", health: 78 },
        ],
      },
      {
        equipment: "Pump Station #3",
        probability: 42,
        estimatedTimeToFailure: "28 days",
        components: [
          { name: "Impeller", health: 65 },
          { name: "Motor", health: 72 },
          { name: "Pressure Sensor", health: 58 },
        ],
      },
    ],
  },

  // Industry data
  industries: [
    {
      title: "Oil & Gas",
      description: "Monitor pipelines, refineries, and offshore platforms.",
      imageUrl: "/oil-rig-sunset.png",
    },
    {
      title: "Transportation & Logistics",
      description: "Track fleet performance and maintenance needs.",
      imageUrl: "/global-logistics-network.png",
    },
    {
      title: "Agriculture (AgriTech)",
      description: "Monitor irrigation systems and equipment health.",
      imageUrl: "/smart-farm-overview.png",
    },
    {
      title: "Aerospace & Defense",
      description: "Ensure critical systems reliability and safety.",
      imageUrl: "/sentinel-skies.png",
    },
    {
      title: "Construction",
      description: "Monitor heavy equipment and prevent costly downtime.",
      imageUrl: "/construction-site-overview.png",
    },
  ],
}
