// Utility functions for EV route calculations

export interface RouteResult {
  totalDistance: number;
  stopsNeeded: number;
  estimatedTime: number; // in minutes
  energyConsumption: number; // in kWh
  chargingTime: number; // in minutes
  costEstimate: number; // in currency
}

export interface TripData {
  origin: string;
  destination: string;
  batteryRange: number; // km
  currentCharge: number; // percentage
  vehicleModel: string;
}

// Vehicle consumption rates (kWh/100km)
export const vehicleConsumption: Record<string, number> = {
  'tesla-model-3': 14.5,
  'tesla-model-y': 16.0,
  'tesla-model-s': 17.5,
  'byd-dolphin': 13.5,
  'byd-seal': 15.5,
  'nissan-leaf': 15.0,
  'chevrolet-bolt': 16.5,
  'hyundai-ioniq': 14.0,
  'volkswagen-id4': 17.0,
  'ford-mustang-mach-e': 18.0,
};

export const vehicleModels = [
  { id: 'tesla-model-3', name: 'Tesla Model 3' },
  { id: 'tesla-model-y', name: 'Tesla Model Y' },
  { id: 'tesla-model-s', name: 'Tesla Model S' },
  { id: 'byd-dolphin', name: 'BYD Dolphin' },
  { id: 'byd-seal', name: 'BYD Seal' },
  { id: 'nissan-leaf', name: 'Nissan Leaf' },
  { id: 'chevrolet-bolt', name: 'Chevrolet Bolt' },
  { id: 'hyundai-ioniq', name: 'Hyundai Ioniq 5' },
  { id: 'volkswagen-id4', name: 'Volkswagen ID.4' },
  { id: 'ford-mustang-mach-e', name: 'Ford Mustang Mach-E' },
];

// Simulates API delay
export const simulateApiDelay = (minMs = 500, maxMs = 1500): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Calculates simulated distance between cities
export const calculateSimulatedDistance = (origin: string, destination: string): number => {
  // Seed based on origin and destination for consistent results
  const seed = (origin + destination).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed % 450) + 50; // 50-500km range
  return random;
};

// Main route calculation function
export const calculateRoute = async (tripData: TripData): Promise<RouteResult> => {
  await simulateApiDelay();
  
  const { batteryRange, currentCharge, vehicleModel } = tripData;
  const totalDistance = calculateSimulatedDistance(tripData.origin, tripData.destination);
  
  // Calculate available range with current charge
  const availableRange = (batteryRange * currentCharge) / 100;
  
  // Calculate consumption
  const consumptionRate = vehicleConsumption[vehicleModel] || 16;
  const energyConsumption = (totalDistance * consumptionRate) / 100;
  
  // Calculate stops needed (charge to 80% each stop for efficiency)
  const effectiveRangePerStop = batteryRange * 0.7; // Account for safety margin
  const remainingDistance = Math.max(0, totalDistance - availableRange);
  const stopsNeeded = Math.ceil(remainingDistance / effectiveRangePerStop);
  
  // Time calculations
  const averageSpeed = 80; // km/h
  const drivingTime = (totalDistance / averageSpeed) * 60; // in minutes
  const chargingTimePerStop = 25; // minutes (fast charging)
  const chargingTime = stopsNeeded * chargingTimePerStop;
  const estimatedTime = drivingTime + chargingTime;
  
  // Cost estimate (average of R$0.50/kWh)
  const costPerKwh = 0.50;
  const costEstimate = energyConsumption * costPerKwh;
  
  return {
    totalDistance,
    stopsNeeded,
    estimatedTime: Math.round(estimatedTime),
    energyConsumption: Math.round(energyConsumption * 10) / 10,
    chargingTime,
    costEstimate: Math.round(costEstimate * 100) / 100,
  };
};

// Format time in hours and minutes
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Generate consumption data for chart
export const generateConsumptionData = (tripData: TripData, result: RouteResult) => {
  const segments = 6;
  const data = [];
  const consumptionRate = vehicleConsumption[tripData.vehicleModel] || 16;
  
  for (let i = 0; i <= segments; i++) {
    const distance = (result.totalDistance / segments) * i;
    const variation = (Math.random() - 0.5) * 4; // ±2 kWh/100km variation
    data.push({
      km: Math.round(distance),
      consumo: Math.round((consumptionRate + variation) * 10) / 10,
      media: consumptionRate,
    });
  }
  
  return data;
};
