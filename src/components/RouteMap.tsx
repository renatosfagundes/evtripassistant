// @ts-ignore
import React, { useRef, useEffect } from 'react';
// @ts-ignore
const H = (window as any).H;

const createDefaultIcon = () => {
  return undefined;
};

export const RouteMap = ({ routeData, origin, destination, waypoints = [] }) => {
  // Prefer explicit props, fallback to routeData
  const mapOrigin = origin || (routeData && routeData.origin);
  const mapDestination = destination || (routeData && routeData.destination);
  const mapWaypoints = waypoints.length ? waypoints : (routeData && routeData.chargingStops) || [];
  console.log('RouteMap props:', { origin: mapOrigin, destination: mapDestination, waypoints: mapWaypoints });
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);
  // Publishable HERE API key (restricted by domain in HERE dashboard)
  const apiKey = '6ZJe_8D4bEeIQ0QzFJaTxz1BThvxl2LHE4WbH0SqSgU';
  const markerRefs = useRef([]);

  const addMarkerToMap = (lat, lng, color, id, data = null) => {
    if (!map.current) {
      console.log('Map not initialized');
      return null;
    }
    const coords = { lat, lng };
    console.log('Adding marker at:', coords);
    const icon = createDefaultIcon();
    const marker = icon ? new H.map.Marker(coords, { icon }) : new H.map.Marker(coords);
    if (data) marker.setData(data);
    map.current.addObject(marker);
    markerRefs.current.push(marker);
    console.log('Marker added:', marker);
    return marker;
  };

  useEffect(() => {
    console.log('HERE Maps API:', H);
    if (!mapRef.current || map.current || !H) {
      if (!mapRef.current) console.log('mapRef not ready');
      if (map.current) console.log('map already initialized');
      if (!H) console.log('HERE Maps API not loaded');
      return;
    }
    platform.current = new H.service.Platform({ apikey: apiKey });
    const defaultLayers = platform.current.createDefaultLayers();
    const center = mapOrigin || { lat: -23.5505, lng: -46.6333 };
    console.log('Initializing map at center:', center);
    const newMap = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center,
        zoom: 10,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
    H.ui.UI.createDefault(newMap, defaultLayers);
    map.current = newMap;
    const handleResize = () => map.current?.getViewPort().resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) map.current.dispose();
    };
  }, [apiKey]);

  useEffect(() => {
    console.log('Marker effect - origin:', mapOrigin, 'destination:', mapDestination, 'waypoints:', mapWaypoints);
    if (!map.current || !H) {
      console.log('Map or HERE API not ready for markers');
      return;
    }
    // Remove previous markers and polylines
    markerRefs.current.forEach(marker => map.current.removeObject(marker));
    markerRefs.current = [];
    if (!map.current || !H) return;
    // Remove all objects from map before adding new group
    map.current.removeObjects(map.current.getObjects());
    const group = new H.map.Group();
    // Add origin marker
    if (mapOrigin) {
      const marker = addMarkerToMap(mapOrigin.lat, mapOrigin.lng, '#4CAF50', 'O', { type: 'origin' });
      if (marker) group.addObject(marker);
    }
    // Add destination marker
    if (mapDestination) {
      const marker = addMarkerToMap(mapDestination.lat, mapDestination.lng, '#F44336', 'D', { type: 'destination' });
      if (marker) group.addObject(marker);
    }
    // Add waypoint markers
    mapWaypoints.forEach((wp, idx) => {
      const marker = addMarkerToMap(wp.lat, wp.lng, '#0099D8', String(idx + 1), { type: 'waypoint', index: idx + 1 });
      if (marker) group.addObject(marker);
    });
    // Plot all polylines (segments)
    if (routeData && Array.isArray(routeData.polylines)) {
      routeData.polylines.forEach((poly, idx) => {
        let lineString;
        if (typeof poly === 'string' && H.geo.LineString.fromFlexiblePolyline) {
          lineString = H.geo.LineString.fromFlexiblePolyline(poly);
        } else if (Array.isArray(poly)) {
          lineString = new H.geo.LineString();
          poly.forEach(pt => {
            if (pt && typeof pt[0] === 'number' && typeof pt[1] === 'number') {
              lineString.pushLatLngAlt(pt[0], pt[1], 0);
            }
          });
        }
        if (lineString) {
          const polyline = new H.map.Polyline(lineString, {
            style: { strokeColor: 'blue', lineWidth: 4 }
          });
          group.addObject(polyline);
        }
      });
    } else if (routeData && routeData.polyline) {
      // Single polyline fallback
      let lineString;
      if (typeof routeData.polyline === 'string' && H.geo.LineString.fromFlexiblePolyline) {
        lineString = H.geo.LineString.fromFlexiblePolyline(routeData.polyline);
      } else if (Array.isArray(routeData.polyline)) {
        lineString = new H.geo.LineString();
        routeData.polyline.forEach(pt => {
          if (pt && typeof pt[0] === 'number' && typeof pt[1] === 'number') {
            lineString.pushLatLngAlt(pt[0], pt[1], 0);
          }
        });
      }
      if (lineString) {
        const polyline = new H.map.Polyline(lineString, {
          style: { strokeColor: 'blue', lineWidth: 4 }
        });
        group.addObject(polyline);
      }
    }
    map.current.addObject(group);
    // Fit map to group bounds, with 10% padding
    const bounds = group.getBoundingBox();
    if (bounds) {
      // Pad bounds by 10%
      const padLat = (bounds.getTop() - bounds.getBottom()) * 0.1;
      const padLng = (bounds.getRight() - bounds.getLeft()) * 0.1;
      const paddedBounds = new H.geo.Rect(
        bounds.getTop() + padLat,
        bounds.getLeft() - padLng,
        bounds.getBottom() - padLat,
        bounds.getRight() + padLng
      );
      map.current.getViewModel().setLookAtData({ bounds: paddedBounds });
    }
  }, [mapOrigin, mapDestination, mapWaypoints, routeData]);

  return (
    <div style={{ width: '100%', minHeight: '500px', height: '500px', border: '1px solid #ddd', borderRadius: '8px', background: '#f5f5f5', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};