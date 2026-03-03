'use client';

import { useEffect, useState } from 'react';
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

const customMarker = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

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
    pickup: [number, number] | null;
    dropoff: [number, number] | null;
    driverLocation?: [number, number] | null;
    showRoute?: boolean;
    onLocationSensed?: (lat: number, lon: number) => void;
}

export default function Map({ pickup, dropoff, driverLocation, showRoute, onLocationSensed }: MapProps) {
    const [currentPos, setCurrentPos] = useState<[number, number]>([40.7128, -74.0060]); // Default to NY
    const [isSensed, setIsSensed] = useState(false);

    useEffect(() => {
        if (!pickup && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPos([latitude, longitude]);
                    setIsSensed(true);
                    if (onLocationSensed) onLocationSensed(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true }
            );
        }
    }, [pickup, onLocationSensed]);

    // Calculate bounds if we have both points
    let bounds: L.LatLngBoundsExpression | undefined = undefined;
    if (pickup && dropoff) {
        bounds = L.latLngBounds(pickup, dropoff);
    }

    const mapCenter = pickup || currentPos;

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <ChangeView
                center={mapCenter}
                zoom={dropoff ? 12 : 14}
                bounds={bounds}
            />

            {/* Pickup Marker */}
            {pickup && (
                <Marker position={pickup} icon={customMarker}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}

            {/* Dropoff Marker */}
            {dropoff && (
                <Marker position={dropoff} icon={customMarker}>
                    <Popup>Dropoff Location</Popup>
                </Marker>
            )}

            {/* Current Sensed Location (if no pickup selected) */}
            {!pickup && isSensed && (
                <Marker position={currentPos} icon={customMarker}>
                    <Popup>Your Current Location</Popup>
                </Marker>
            )}

            {/* Route Line */}
            {showRoute && pickup && dropoff && (
                <Polyline positions={[pickup, dropoff]} color="#2563eb" weight={4} opacity={0.7} />
            )}
        </MapContainer>
    );
}
