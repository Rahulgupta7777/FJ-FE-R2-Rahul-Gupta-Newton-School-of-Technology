'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polyline,
    useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from 'next-themes';

// Fix for default marker icons missing in Next.js + Leaflet
if (typeof window !== 'undefined') {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            require('leaflet/dist/images/marker-icon-2x.png').default?.src ||
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl:
            require('leaflet/dist/images/marker-icon.png').default?.src ||
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl:
            require('leaflet/dist/images/marker-shadow.png').default?.src ||
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}

const customMarker = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

const busIcon = (bearing: number = 0) => new L.DivIcon({
    html: `<div style="transform: rotate(${bearing}deg); transition: transform 0.5s ease-in-out;">
             <img src="/top-down-bus.png" style="width: 48px; height: 48px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));" />
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -20],
    className: 'bus-marker-birdseye'
});

// Auto adjust map view
function ChangeView({
    center,
    zoom,
    bounds
}: {
    center: [number, number];
    zoom: number;
    bounds?: L.LatLngBoundsExpression;
}) {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [60, 60] });
        } else {
            map.setView(center, zoom);
        }
    }, [center, zoom, bounds, map]);

    return null;
}

interface MapProps {
    pickup: [number, number] | null;
    dropoff: [number, number] | null;
    driverLocation?: [number, number] | null;
    showRoute?: boolean;
    onLocationSensed?: (lat: number, lon: number) => void;
    onMapClick?: (lat: number, lon: number) => void;
}

function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lon: number) => void }) {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    return null;
}

interface Bus {
    id: string;
    latitude: number;
    longitude: number;
    speed?: number;
    bearing?: number;
    routeId?: string;
}

export default function Map({
    pickup,
    dropoff,
    driverLocation,
    showRoute,
    onLocationSensed,
    onMapClick
}: MapProps) {
    const { resolvedTheme } = useTheme();

    const [currentPos, setCurrentPos] = useState<[number, number]>([40.7128, -74.0060]); // Defaults to NY, but will jump to Delhi if buses found nearby
    const [isSensed, setIsSensed] = useState(false);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [prevBuses, setPrevBuses] = useState<Record<string, { lat: number, lon: number }>>({});
    const [busBearings, setBusBearings] = useState<Record<string, number>>({});

    // Fetch live buses from Delhi Transport API via proxy
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const res = await fetch('/api/buses');
                if (res.ok) {
                    const data = await res.json();
                    if (data.buses) {
                        setBuses(prev => {
                            // Update previous positions
                            const newPrev = { ...prevBuses };
                            prev.forEach(b => newPrev[b.id] = { lat: b.latitude, lon: b.longitude });
                            setPrevBuses(newPrev);

                            // Calculate bearings for moved buses
                            const newBearings = { ...busBearings };
                            data.buses.forEach((b: Bus) => {
                                const old = prevBuses[b.id];
                                if (old && (old.lat !== b.latitude || old.lon !== b.longitude)) {
                                    // Calculate bearing
                                    const y = Math.sin((b.longitude - old.lon) * Math.PI / 180) * Math.cos(b.latitude * Math.PI / 180);
                                    const x = Math.cos(old.lat * Math.PI / 180) * Math.sin(b.latitude * Math.PI / 180) -
                                        Math.sin(old.lat * Math.PI / 180) * Math.cos(b.latitude * Math.PI / 180) * Math.cos((b.longitude - old.lon) * Math.PI / 180);
                                    const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
                                    newBearings[b.id] = brng;
                                } else if (!newBearings[b.id] && b.bearing) {
                                    newBearings[b.id] = b.bearing;
                                }
                            });
                            setBusBearings(newBearings);

                            return data.buses;
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch buses", err);
            }
        };

        fetchBuses();
        const interval = setInterval(fetchBuses, 5000); // 5s poll
        return () => clearInterval(interval);
    }, []);

    // Detect user location
    useEffect(() => {
        if (!pickup && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setCurrentPos([latitude, longitude]);
                    setIsSensed(true);

                    if (onLocationSensed) {
                        onLocationSensed(latitude, longitude);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true }
            );
        }
    }, [pickup, onLocationSensed]);

    // Fetch route automatically
    useEffect(() => {

        if (showRoute && pickup && dropoff) {
            // Show straight line immediately as fallback
            setRoute([pickup, dropoff]);

            const fetchRoute = async () => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`,
                        { signal: controller.signal }
                    );

                    clearTimeout(timeoutId);
                    const data = await response.json();

                    if (data.routes && data.routes.length > 0) {
                        const coords = data.routes[0].geometry.coordinates.map(
                            (coord: [number, number]) => [coord[1], coord[0]]
                        ) as [number, number][];

                        setRoute(coords);
                    }

                } catch (error) {
                    console.error("OSRM route error:", error);
                    // Keep the straight line fallback
                }
            };

            // Add small delay to prevent race conditions
            const timeoutId = setTimeout(fetchRoute, 300);
            return () => clearTimeout(timeoutId);

        } else {
            setRoute([]);
        }

    }, [showRoute, pickup, dropoff]);

    // Compute bounds and active center
    let bounds: L.LatLngBoundsExpression | undefined = undefined;

    if (pickup && dropoff) {
        bounds = L.latLngBounds(pickup, dropoff);
    }

    const mapCenter = pickup || currentPos;

    // Nearest Buses Logic: Show top 50 strictly closest to the map center.
    // If no pickup/dropoff, snap map to Delhi by utilizing the first loaded bus coordinate if geolocation hasn't activated yet.
    useEffect(() => {
        if (!isSensed && !pickup && buses.length > 0 && currentPos[0] === 40.7128) {
            // Jump to New Delhi based on 1st bus
            setCurrentPos([buses[0].latitude, buses[0].longitude]);
        }
    }, [buses, isSensed, pickup, currentPos]);

    const nearestBuses = useMemo(() => {
        if (!buses.length) return [];
        const centerLat = mapCenter[0];
        const centerLon = mapCenter[1];

        const distances = buses.map(bus => {
            const dLat = bus.latitude - centerLat;
            const dLon = bus.longitude - centerLon;

            // Generate a stable "pseudo-random" bearing based on ID for stationary buses
            const idHash = bus.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const initialBearing = idHash % 360;

            return {
                ...bus,
                distSq: dLat * dLat + dLon * dLon,
                bearing: busBearings[bus.id] || bus.bearing || initialBearing
            };
        });

        distances.sort((a, b) => a.distSq - b.distSq);
        return distances.slice(0, 50);
    }, [buses, mapCenter, busBearings]);

    return (

        <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >

            <TileLayer
                key={resolvedTheme}
                url={
                    resolvedTheme === "dark"
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                }
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            />

            <MapEvents onMapClick={onMapClick} />

            <ChangeView
                center={mapCenter}
                zoom={dropoff ? 12 : 14}
                bounds={bounds}
            />

            {/* Pickup */}
            {pickup && (
                <Marker position={pickup} icon={customMarker}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}

            {/* Destination/Dropoff Location */}
            {dropoff && (
                <Marker
                    position={dropoff}
                    icon={new L.DivIcon({
                        html: `<div style="display:flex; justify-content:center; align-items:center; width:36px; height:36px; background:${resolvedTheme === 'dark' ? 'white' : 'black'}; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.3);">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${resolvedTheme === 'dark' ? 'black' : 'white'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                               </div>`,
                        className: 'custom-dest-marker',
                        iconSize: [36, 36],
                        iconAnchor: [18, 36],
                        popupAnchor: [0, -36],
                    })}
                >
                    <Popup>Dropoff Location</Popup>
                </Marker>
            )}

            {/* Current location */}
            {!pickup && isSensed && (
                <Marker position={currentPos} icon={customMarker}>
                    <Popup>Your Current Location</Popup>
                </Marker>
            )}

            {/* Live Buses via OTD */}
            {nearestBuses.map(bus => (
                <Marker key={bus.id} position={[bus.latitude, bus.longitude]} icon={busIcon(bus.bearing)}>
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-lg mb-1">{bus.routeId ? `Route: ${bus.routeId}` : 'Delhi Bus'}</h3>
                            <p className="text-sm text-gray-600">Bus ID: {bus.id}</p>
                            {bus.speed && <p className="text-sm text-gray-600">Speed: {(bus.speed * 3.6).toFixed(1)} km/h</p>}
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Driver */}
            {driverLocation && (
                <Marker
                    position={driverLocation}
                    icon={new L.DivIcon({
                        html: `<div style="display:flex; justify-content:center; align-items:center; width:40px; height:40px; background:${resolvedTheme === 'dark' ? 'white' : 'black'}; border-radius:50%; box-shadow:0 4px 6px rgba(0,0,0,0.3);">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${resolvedTheme === 'dark' ? 'black' : 'white'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                               </div>`,
                        className: 'custom-car-marker',
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    })}
                >
                    <Popup>Your Driver is Here</Popup>
                </Marker>
            )}

            {/* Route */}
            {showRoute && route.length > 0 && (
                <Polyline
                    key={`${route.length}-${resolvedTheme}`}
                    positions={route}
                    color={resolvedTheme === 'dark' ? "#ffffff" : "#0f1011ff"}
                    weight={5}
                    opacity={0.8}
                />
            )}

        </MapContainer>
    );
}