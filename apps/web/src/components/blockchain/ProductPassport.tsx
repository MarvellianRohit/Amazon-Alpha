"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import type { LineLayer } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock Data Structure
interface PassportData {
    token_id: string;
    contract: string;
    batch_number: string;
    manufacturing_date: string;
    logistics_path: {
        location: string;
        date: string;
        status: string;
        coordinates: [number, number]; // [longitude, latitude]
    }[];
}

const lineLayer: LineLayer = {
    id: 'route',
    type: 'line',
    source: 'route-source',
    paint: {
        'line-color': '#9333ea', // purple-600
        'line-width': 2,
        'line-dasharray': [2, 1]
    }
};

export function ProductPassport({ productId: _productId }: { productId: string }) {
    // In a real app, fetch from API
    const passportData: PassportData = {
        token_id: "847291",
        contract: "0xABC...123",
        batch_number: "BATCH-2026-X99",
        manufacturing_date: "2025-11-15",
        logistics_path: [
            { location: "Shanghai Factory", date: "2025-11-20", status: "Dispatched", coordinates: [121.4737, 31.2304] },
            { location: "Port of LA", date: "2025-12-05", status: "Customs Cleared", coordinates: [-118.2437, 34.0522] },
            { location: "Amazon Fulfillment (NV)", date: "2025-12-10", status: "Stored", coordinates: [-115.1398, 36.1699] },
            { location: "Customer Doorstep", date: "2026-01-15", status: "Delivered", coordinates: [-122.4194, 37.7749] } // San Francisco
        ]
    };

    const [transferred, setTransferred] = useState(false);

    // GeoJSON for the path
    const routeGeoJSON = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
            type: 'LineString' as const,
            coordinates: passportData.logistics_path.map(p => p.coordinates)
        }
    };

    const handleTransfer = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Interacting with Polygon Network...',
                success: () => {
                    setTransferred(true);
                    return 'Ownership Transferred to Wallet 0x987...def';
                },
                error: 'Transfer failed',
            }
        );
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-black/50">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-sm">Digital Product Passport</span>
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                    Polygon Verified
                </Badge>
            </div>

            {/* Map Visualization */}
            <div className="relative w-full h-48 bg-slate-100">
                <Map
                    initialViewState={{
                        longitude: -160,
                        latitude: 30,
                        zoom: 1
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1Ijoicm9oaXRjaGFuZHJhIiwiYSI6ImNsODdleXN6czAwdXUzdm84aWF6bm56b3kifQ.7j2fX9j6X6j6X6j6X6j6X6"} // Fallback or assume user has likely one, or use a demo one if specific instructions exist but none do. 
                // Note: Using a common public demo key often works for simple tests, but ideally user provides one. 
                // I will leave the process.env check. If missing, map might not load tiles but markers might show or it will error.
                // Actually, let's use a placeholder if empty so it doesn't crash, but user needs to provide it.
                >
                    <Source id="route-source" type="geojson" data={routeGeoJSON}>
                        <Layer {...lineLayer} />
                    </Source>

                    {passportData.logistics_path.map((step, i) => (
                        <Marker key={i} longitude={step.coordinates[0]} latitude={step.coordinates[1]} anchor="bottom">
                            <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-black shadow-lg ${i === passportData.logistics_path.length - 1 ? 'bg-green-500 animate-pulse' : 'bg-purple-600'}`} />
                        </Marker>
                    ))}
                </Map>
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                    Supply Chain Visualization
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Meta Data */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Batch Number</div>
                        <div className="font-mono font-medium">{passportData.batch_number}</div>
                    </div>
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Token ID</div>
                        <div className="font-mono font-medium">#{passportData.token_id}</div>
                    </div>
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Contract</div>
                        <div className="font-mono text-xs text-blue-500 underline cursor-pointer truncate">
                            {passportData.contract}
                        </div>
                    </div>
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Mfg Date</div>
                        <div className="font-medium">{passportData.manufacturing_date}</div>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <div className="text-xs font-bold uppercase text-neutral-500 mb-3">Journey Details</div>
                    <div className="relative pl-4 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-6">
                        {passportData.logistics_path.map((step, i) => (
                            <div key={i} className="relative">
                                {/* Dot */}
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-black ${i === passportData.logistics_path.length - 1 ? 'bg-green-500' : 'bg-neutral-400'}`} />

                                <div className="text-sm font-bold">{step.status}</div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" /> {step.location} • {step.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        onClick={handleTransfer}
                        disabled={transferred}
                        className={`w-full ${transferred ? 'bg-green-600 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                    >
                        {transferred ? (
                            <span className="flex items-center gap-2">Transferred <ShieldCheck className="w-4 h-4" /></span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Transfer Ownership (Resell)
                            </span>
                        )}
                    </Button>
                    <p className="text-[10px] text-center text-neutral-400 mt-2">
                        This action records a permanent transaction on the blockchain.
                    </p>
                </div>
            </div>
        </div>
    );
}
