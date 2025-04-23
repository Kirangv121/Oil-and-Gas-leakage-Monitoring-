// Industry data with leak types and sensors
export const industryData = {
  "oil-gas": {
    title: "Oil & Gas Industry",
    description: "Monitor and detect leaks across oil and gas infrastructure",
    leakTypes: [
      {
        title: "Pipeline Corrosion",
        description: "Leaks caused by corrosion in pipelines",
        sensors: ["Pressure Sensor", "Temperature Sensor"],
      },
      {
        title: "Faulty Valves",
        description: "Leaks resulting from valve failures or improper sealing",
        sensors: ["Acoustic Sensor", "Vibration Sensor", "Pressure Sensor"],
      },
      {
        title: "Pressure Surges",
        description: "Leaks caused by sudden pressure changes in the system",
        sensors: ["Pressure Sensor", "Vibration Sensor"],
      },
      {
        title: "Blowouts",
        description: "Catastrophic leaks from well control failures",
        sensors: ["MQ-135 Sensor", "IR Flame Sensor", "Acoustic Sensor"],
      },
    ],
  },
  transportation: {
    title: "Transportation & Logistics",
    description: "Monitor and detect leaks across transportation and logistics operations",
    leakTypes: [
      {
        title: "Tanker Truck Rollovers",
        description: "Leaks resulting from tanker truck accidents",
        sensors: ["Vibration Sensor", "Fuel Sensor"],
      },
      {
        title: "Railcar Valve/Seal Failures",
        description: "Leaks from failed valves or seals in rail transport",
        sensors: ["MQ-135 Sensor", "Acoustic Sensor", "Vibration Sensor"],
      },
      {
        title: "Ship Leakages",
        description: "Leaks from maritime vessels and tankers",
        sensors: ["Fuel & Oil Sensing Cable", "Water-in-Oil Sensor"],
      },
    ],
  },
  agriculture: {
    title: "Agriculture (AgriTech)",
    description: "Monitor and detect leaks across agricultural operations",
    leakTypes: [
      {
        title: "Fuel Tank Leaks",
        description: "Leaks from fuel storage tanks in agricultural settings",
        sensors: ["Fuel & Oil Cable", "MQ-135 Sensor", "Capacitive Fuel Sensor"],
      },
      {
        title: "Pipeline Leaks",
        description: "Leaks in irrigation or fuel distribution pipelines",
        sensors: ["Pressure Sensor", "Acoustic Sensor", "MQ-135 Sensor"],
      },
      {
        title: "Undetected Storage Leaks",
        description: "Slow leaks in storage facilities that go unnoticed",
        sensors: ["Temperature Sensor", "Humidity Sensor", "MQ-135 Sensor"],
      },
    ],
  },
  aerospace: {
    title: "Aerospace & Defense",
    description: "Monitor and detect leaks across aerospace and defense operations",
    leakTypes: [
      {
        title: "Fuel/Hydraulic Leaks",
        description: "Leaks in aircraft fuel or hydraulic systems",
        sensors: ["Fuel Cable", "MQ-135 Sensor", "Vibration Sensor"],
      },
      {
        title: "Military Base Tank Leaks",
        description: "Leaks from fuel storage tanks at military installations",
        sensors: ["MQ-135 Sensor", "Acoustic Sensor", "Soil Moisture Sensor"],
      },
      {
        title: "Jet Fuel Leakages",
        description: "Leaks specific to jet fuel storage and distribution",
        sensors: ["IR Flame Sensor", "MQ-135 Sensor", "Temperature Sensor"],
      },
    ],
  },
  construction: {
    title: "Construction",
    description: "Monitor and detect leaks across construction sites and equipment",
    leakTypes: [
      {
        title: "Machinery Fuel Leaks",
        description: "Leaks from construction equipment and machinery",
        sensors: ["Fuel Cable", "Vibration Sensor"],
      },
      {
        title: "Storage Tank Ruptures",
        description: "Leaks from damaged storage tanks at construction sites",
        sensors: ["Pressure Sensor", "Temperature Sensor", "MQ-135 Sensor"],
      },
      {
        title: "Fuel Theft",
        description: "Unauthorized removal of fuel from construction equipment",
        sensors: ["Ultrasonic Fuel Level Sensor", "Vibration Sensor"],
      },
    ],
  },
}
