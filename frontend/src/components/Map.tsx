'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons missing in Next.js + Leaflet
if (typeof window !== 'undefined') {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default?.src || 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: require('leaflet/dist/images/marker-icon.png').default?.src || 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: require('leaflet/dist/images/marker-shadow.png').default?.src || 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}

// Component to dynamically adjust map view based on markers
function ChangeView({ center, zoom, bounds }: { center: [number, number]; zoom: number, bounds?: L.LatLngBoundsExpression }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(center, zoom);
        }
    }, [center, zoom, bounds, map]);
    return null;
}

interface MapProps {
    pickup: [number, number];
    dropoff: [number, number] | null;
    driverLocation: [number, number] | null;
    showRoute?: boolean;
}

export default function Map({ pickup, dropoff, driverLocation, showRoute }: MapProps) {
    // Calculate bounds if we have both points
    let bounds: L.LatLngBoundsExpression | undefined = undefined;
    if (pickup && dropoff) {
        bounds = L.latLngBounds(pickup, dropoff);
    } else if (pickup && driverLocation) {
        bounds = L.latLngBounds(pickup, driverLocation);
    }

    // Simple route simulation (straight line for visual purposes in demo)
    const routePositions: [number, number][] = (pickup && dropoff) ? [pickup, dropoff] : [];

    return (
        <MapContainer center={pickup} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            {/* Modern grayscale/light basemap for clear UI */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <ChangeView center={pickup} zoom={dropoff ? 12 : 14} bounds={bounds} />

            {/* Pickup Marker */}
            <Marker position={pickup}>
                <Popup>Pickup Location</Popup>
            </Marker>

            {/* Dropoff Marker */}
            {dropoff && (
                <Marker position={dropoff}>
                    <Popup>Dropoff</Popup>
                </Marker>
            )}

            {/* Driver Marker */}
            {driverLocation && (
                <Marker position={driverLocation}>
                    <Popup>Driver</Popup>
                </Marker>
            )}

            {/* Route Line */}
            {showRoute && routePositions.length > 1 && (
                <Polyline positions={routePositions} color="#2563eb" weight={4} opacity={0.7} />
            )}
        </MapContainer>
    );
}
