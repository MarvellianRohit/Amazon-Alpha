"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera, Stars, Float } from "@react-three/drei";
import { Suspense } from "react";

function ProductPedestal({ position, color, onClick }: { position: [number, number, number], color: string, onClick?: () => void }) {
    return (
        <group position={position} onClick={onClick}>
            {/* Floating Product Cube Placeholder */}
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <mesh
                    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
                    onPointerOut={(e) => { document.body.style.cursor = 'default' }}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
                </mesh>
            </Float>

            {/* Pedestal Base */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.8, 1, 0.5, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Spotlight */}
            <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />
        </group>
    );
}

export function StoreEnvironment() {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 2, 10]} />
                <OrbitControls enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={20} />

                {/* Atmosphere */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
                <ambientLight intensity={0.5} />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
                    <gridHelper args={[50, 50, 0xff0000, 0x222222]} />
                </mesh>

                {/* Products */}
                <Suspense fallback={null}>
                    <ProductPedestal position={[0, 0, 0]} color="#ff0055" />
                    <ProductPedestal position={[-4, 0, 2]} color="#00cc88" />
                    <ProductPedestal position={[4, 0, 2]} color="#0099ff" />
                </Suspense>

            </Canvas>

            {/* UI Overlay */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                    THE HOLODECK
                </h1>
                <p className="text-white/60 text-sm mt-2">Drag to rotate • Scroll to zoom • Click items to inspect</p>
            </div>
        </div>
    );
}
