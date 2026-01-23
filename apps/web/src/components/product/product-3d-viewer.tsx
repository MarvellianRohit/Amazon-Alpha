"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Grid, Stage, Sparkles, Float, ContactShadows, Torus, Environment } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function RotatingRings({ color }: { color: string }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            // Slow, majestic rotation
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Inner Ring - Glowing Pulse */}
            <Torus args={[1.4, 0.02, 16, 100]} rotation={[1.5, 0, 0]}>
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} toneMapped={false} />
            </Torus>

            {/* Outer Ring - Glassy Sci-fi */}
            <Torus args={[1.8, 0.04, 16, 100]} rotation={[0, 0, 1]}>
                <meshPhysicalMaterial
                    color={color}
                    transmission={0.4}
                    opacity={0.6}
                    metalness={0.8}
                    roughness={0}
                    ior={1.5}
                    thickness={0.1}
                    transparent
                />
            </Torus>
        </group>
    )
}

function FloatingShape({ color }: { color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
            <group>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    scale={hovered ? 1.05 : 1}
                >
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshDistortMaterial
                        color={hovered ? "#60a5fa" : color}
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        metalness={0.5}
                        roughness={0.2}
                        distort={0.35}
                        speed={2.5}
                    />
                </mesh>

                <RotatingRings color={color} />
            </group>
        </Float>
    );
}

interface Product3DViewerProps {
    color?: string;
}

export function Product3DViewer({ color = "#c026d3" }: Product3DViewerProps) {
    return (
        <div className="w-full h-full min-h-[400px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl group">

            {/* HUD Elements */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <div className="bg-indigo-600/90 backdrop-blur px-3 py-1 rounded-sm border-l-2 border-white">
                    <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">Holodeck 2.0</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">SYS.ONLINE // READY</span>
            </div>

            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                {/* Lighting Environment */}
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} castShadow color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={1} color={color} />

                {/* Environment Reflections */}
                <Environment preset="city" />

                {/* The Object */}
                <Float speed={1} rotationIntensity={0} floatIntensity={0}>
                    <FloatingShape color={color} />
                </Float>

                {/* Particles */}
                <Sparkles
                    count={50}
                    scale={6}
                    size={4}
                    speed={0.4}
                    opacity={0.5}
                    color="#fff"
                />

                {/* Ground Shadows */}
                <ContactShadows
                    resolution={1024}
                    scale={10}
                    blur={2}
                    opacity={0.5}
                    far={2}
                    color="#000"
                    position={[0, -1.6, 0]}
                />

                {/* Cyberpunk Grid Floor */}
                <Grid
                    renderOrder={-1}
                    position={[0, -1.8, 0]}
                    infiniteGrid
                    cellSize={0.5}
                    sectionSize={2.5}
                    fadeDistance={20}
                    sectionColor={color}
                    cellColor="#312e81"
                />

                <OrbitControls
                    autoRotate
                    autoRotateSpeed={1.5}
                    enableZoom={true}
                    makeDefault
                    minDistance={3}
                    maxDistance={10}
                />
            </Canvas>
        </div>
    );
}
