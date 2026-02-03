// src/lib/api.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ev-trip-assistant.onrender.com';

export async function getChargingStations(lat: number, lon: number, range?: number) {
  const params: Record<string, any> = { lat, lon };
  if (range) params.range = range;
  const res = await axios.get(`${BASE_URL}/api/charging/stations`, { params });
  return res.data;
}

export async function planTrip(origin: string, destination: string, autonomy: number) {
  const res = await axios.post(`${BASE_URL}/api/trip/plan`, { origin, destination, autonomy });
  return res.data;
}

export async function getEfficiencyDashboard(dist: number, bat: number) {
  const params = { dist, bat };
  const res = await axios.get(`${BASE_URL}/api/efficiency/dashboard`, { params });
  return res.data;
}

export async function sendChatbotMessage(message: string) {
  const res = await axios.post(`${BASE_URL}/api/chatbot`, { message });
  return res.data;
}
