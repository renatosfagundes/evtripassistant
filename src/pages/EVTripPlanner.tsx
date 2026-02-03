import React, { useState } from 'react';
import { TripForm } from '../components/TripForm';
import { RouteMap } from '../components/RouteMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Zap } from 'lucide-react';
import { planTrip } from '@/lib/api';

// RouteInfo component
const RouteInfo = ({ routeStats }: { routeStats: any }) => {
  if (!routeStats) return null;
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Informações da Rota
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{routeStats.distance || '-'}</p>
          <p className="text-sm text-muted-foreground">Distância</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{routeStats.duration || '-'}</p>
          <p className="text-sm text-muted-foreground">Tempo</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{routeStats.stops || 0}</p>
          <p className="text-sm text-muted-foreground">Paradas</p>
        </div>
      </CardContent>
    </Card>
  );
};

// ChargingStopsList component
const ChargingStopsList = ({ chargingStops }: { chargingStops: any[] }) => {
  if (!chargingStops || chargingStops.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Paradas de Carregamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {chargingStops.map((stop, idx) => (
            <li key={stop.id || idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {idx + 1}
              </div>
              <div>
                <p className="font-medium">{stop.name}</p>
                {stop.address && <p className="text-sm text-muted-foreground">{stop.address}</p>}
                {stop.chargingTime && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stop.chargingTime} min
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function EVTripPlanner() {
  const [routeData, setRouteData] = useState<any>(null);
  const [routeStats, setRouteStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanTrip = async (formData: { origin: string; destination: string; autonomy: number }) => {
    setLoading(true);
    setError(null);
    setRouteData(null);
    setRouteStats(null);
    try {
      const response = await planTrip(formData.origin, formData.destination, formData.autonomy);
      const data = response?.data || response;
      setRouteData(data);
      // Extract stats from routeData
      if (data) {
        setRouteStats({
          distance: data.distanceTotal ? `${data.distanceTotal} km` : '-',
          duration: data.durationTotal || '-',
          stops: data.chargingStops?.length || 0,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#495057', marginBottom: 30 }}>EV Trip Planner</h1>
      <TripForm onSubmit={handlePlanTrip} loading={loading} />
      {error && <div style={{ color: '#c33', marginBottom: 16 }}>Error: {error}</div>}
      {routeStats && <RouteInfo routeStats={routeStats} />}
      {routeData && (
        <>
          <RouteMap 
            routeData={routeData} 
            origin={routeData.origin ? { lat: routeData.origin.lat, lng: routeData.origin.lon } : undefined}
            destination={routeData.destination ? { lat: routeData.destination.lat, lng: routeData.destination.lon } : undefined}
            waypoints={(routeData.chargingStops || []).map((s: any) => ({ lat: s.lat, lng: s.lon }))}
          />
          <div style={{ marginTop: 20 }}>
            <ChargingStopsList chargingStops={routeData.chargingStops} />
          </div>
        </>
      )}
    </div>
  );
}
