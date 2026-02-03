import React, { useState } from 'react';
import { TripForm } from '../components/TripForm';
import { RouteMap, RouteInfo, ChargingStopsList } from '../components/RouteMap';

// Utility: fetch trip plan from backend
async function fetchTripPlan({ origin, destination, autonomy }) {
  const res = await fetch('/api/trip/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, autonomy }),
  });
  if (!res.ok) throw new Error('Failed to fetch trip plan');
  return res.json();
}

export default function EVTripPlanner() {
  const [routeData, setRouteData] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlanTrip = async (formData) => {
    setLoading(true);
    setError(null);
    setRouteData(null);
    setRouteStats(null);
    try {
      const data = await fetchTripPlan(formData);
      setRouteData(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteLoad = (stats) => setRouteStats(stats);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#495057', marginBottom: 30 }}>EV Trip Planner</h1>
      <TripForm onSubmit={handlePlanTrip} loading={loading} />
      {error && <div style={{ color: '#c33', marginBottom: 16 }}>Error: {error}</div>}
      {routeStats && <RouteInfo routeStats={routeStats} />}
      {routeData && (
        <>
          <RouteMap routeData={routeData} onRouteLoad={handleRouteLoad} />
          <div style={{ marginTop: 20 }}>
            <ChargingStopsList chargingStops={routeData.chargingStops} />
          </div>
        </>
      )}
    </div>
  );
}
