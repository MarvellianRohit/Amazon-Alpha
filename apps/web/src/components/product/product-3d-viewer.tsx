import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Grid, Sparkles, Float, ContactShadows, Torus, Environment, Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

function RotatingRings({ color }: { color: string }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <Torus args={[1.6, 0.01, 16, 100]} rotation={[1.5, 0, 0]}>
                <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
            </Torus>

            <Torus args={[2.0, 0.02, 16, 100]} rotation={[0, 0, 1]}>
                <meshPhysicalMaterial
                    color={color}
                    transmission={0.4}
                    opacity={0.3}
                    metalness={0.8}
                    roughness={0}
                    transparent
                />
            </Torus>
        </group>
    )
}

function ProductHologram({ image, color }: { image?: string, color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = image ? useLoader(THREE.TextureLoader, image) : null;

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
        }
    });

    return (
        <group>
            {texture ? (
                <mesh ref={meshRef}>
                    <planeGeometry args={[2.5, 2.5]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={0.9}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                    />
                    {/* Add a scanline effect / glow */}
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[2.6, 2.6]} />
                        <meshBasicMaterial color={color} transparent opacity={0.2} />
                    </mesh>
                </mesh>
            ) : (
                <mesh ref={meshRef}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshDistortMaterial
                        color={color}
                        envMapIntensity={1}
                        distort={0.4}
                        speed={2}
                        metalness={0.5}
                    />
                </mesh>
            )}
            <RotatingRings color={color} />
        </group>
    );
}

interface Product3DViewerProps {
    color?: string;
    productImage?: string;
    productName?: string;
}

export function Product3DViewer({ color = "#4f46e5", productImage, productName }: Product3DViewerProps) {
    return (
        <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-2xl overflow-hidden relative border-2 border-slate-800/50 shadow-2xl">

            {/* Sci-Fi HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none z-10 border-[1px] border-indigo-500/10 m-4 flex flex-col justify-between p-4 uppercase font-mono tracking-tighter">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-white text-sm font-bold">Holodeck Visualizer v4.2</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Scanning Object: {productName || "Unknown"}</p>
                    </div>
                    <div className="text-right text-[10px] text-indigo-400">
                        <p>LAT: 40.7128° N</p>
                        <p>LNG: 74.0060° W</p>
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-indigo-500/10 pt-4">
                    <div className="flex gap-4">
                        <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-600">Integrity</p>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[92%]" />
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-600">Signal</p>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[78%] animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-indigo-500 opacity-50">Secure Connection Validated</span>
                </div>
            </div>

            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 40 }}>
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} color={color} intensity={0.5} />

                <Environment preset="night" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <ProductHologram image={productImage} color={color} />
                </Float>

                <ContactShadows
                    resolution={1024}
                    scale={10}
                    blur={3}
                    opacity={0.4}
                    far={2}
                    color="#000"
                    position={[0, -2.5, 0]}
                />

                <Grid
                    position={[0, -2.6, 0]}
                    infiniteGrid
                    cellSize={0.5}
                    sectionSize={2}
                    fadeDistance={25}
                    sectionThickness={1}
                    sectionColor={color}
                    cellColor="#1e293b"
                />

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
