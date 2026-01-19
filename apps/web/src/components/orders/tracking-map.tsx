"use client";

import { MapPin, Truck, Navigation } from "lucide-react";

export function TrackingMap({ orderId }: { orderId: string }) {
    // Reverted to Mock due to persistent build environment issues resolving 'react-map-gl'.
    // In a production environment with working node_modules, you would uncomment the real Mapbox code.

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border shadow-sm bg-slate-50 relative group">
            {/* Map Background (Simulated) */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,10,0/800x600?access_token=mock")', // Mock URL for visual idea
                    // Fallback pattern
                    background: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Decorative "Map" Elements */}
            <div className="absolute inset-0 bg-[url('/map-pattern.png')] opacity-10" />

            {/* Route Line (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md">
                <path
                    d="M 100 300 Q 250 150 400 100 T 700 80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    className="animate-pulse"
                />
            </svg>

            {/* Origin */}
            <div className="absolute left-[80px] top-[280px] flex flex-col items-center group-hover:scale-110 transition-transform">
                <div className="w-5 h-5 bg-gray-500 rounded-full border-4 border-white shadow-lg" />
                <span className="text-xs font-bold bg-white/90 px-2 py-0.5 rounded shadow mt-1 text-gray-700">Warehouse</span>
            </div>

            {/* Destination */}
            <div className="absolute right-[50px] top-[60px] flex flex-col items-center group-hover:scale-110 transition-transform">
                <div className="relative">
                    <MapPin className="w-10 h-10 text-red-500 drop-shadow-xl fill-current" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
                </div>
                <span className="text-xs font-bold bg-white/90 px-2 py-0.5 rounded shadow mt-1 text-red-600">My Home</span>
            </div>

            {/* Truck */}
            <div className="absolute left-[300px] top-[140px] animate-bounce">
                <div className="bg-blue-600 p-2 rounded-full shadow-lg border-2 border-white transform -rotate-12 z-10 relative">
                    <Truck className="w-5 h-5 text-white" />
                </div>
                {/* Ripple Effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Controls Mock */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-2">
                <div className="bg-white p-2 rounded shadow text-gray-500 hover:text-black cursor-pointer"><Navigation className="w-4 h-4" /></div>
            </div>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 text-sm max-w-[240px]">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="font-bold text-gray-800">In Transit</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">Your package is moving smoothly.</p>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%]" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>SF</span>
                    <span>NYC</span>
                </div>
            </div>

            <div className="absolute bottom-2 right-2 text-[10px] text-gray-400">
                Mock Map View (Environment Issue)
            </div>
        </div>
    );
}
