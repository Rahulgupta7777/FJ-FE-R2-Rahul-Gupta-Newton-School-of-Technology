import { NextResponse } from 'next/server';
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const GTFS_URL = 'https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key=wM0mUUHkzVQQ1wxLXbctPQdzsJKfqxHM';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const response = await fetch(GTFS_URL, {
            headers: {
                "Accept": "application/x-protobuf"
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

        const buses: any[] = [];
        for (const entity of feed.entity) {
            if (entity.vehicle && entity.vehicle.position) {
                buses.push({
                    id: entity.vehicle.vehicle?.id || entity.id,
                    latitude: entity.vehicle.position.latitude,
                    longitude: entity.vehicle.position.longitude,
                    speed: entity.vehicle.position.speed,
                    bearing: entity.vehicle.position.bearing,
                    routeId: entity.vehicle.trip?.routeId,
                });
            }
        }

        return NextResponse.json({ buses });
    } catch (error) {
        console.error("Error fetching GTFS:", error);
        return NextResponse.json({ error: 'Failed to fetch bus positions' }, { status: 500 });
    }
}
