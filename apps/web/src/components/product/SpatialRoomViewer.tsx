"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from "@react-three/drei";
import { useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { toast } from "sonner";
import { Maximize, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function SimulatedProduct({ position, isColliding, onPositionChange }: any) {
    const mesh = useRef<THREE.Group>(null);
    const [dragging, setDragging] = useState(false);

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.005; // Idle animation
        }
    });

    // Simple Drag Logic (Mocked for 2D plane)
    const handlePointerMove = (e: any) => {
        if (dragging && mesh.current) {
            // Project ray-cast to floor plane normally
            // efficient logic: update x/z
            const newPos = [e.point.x, 0, e.point.z];
            onPositionChange(newPos);
        }
    };

    return (
        <group
            ref={mesh}
            position={position}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
        // onPointerMove handled by parent Plane for smoothness
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={isColliding ? "#ff4444" : "#4f46e5"}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={isColliding ? "#ff0000" : "#000000"}
                    emissiveIntensity={isColliding ? 0.5 : 0}
                />
            </mesh>
            {isColliding && (
                <Html position={[0, 1.2, 0]} center>
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> COLLISION
                    </div>
                </Html>
            )}
        </group>
    );
}

function RoomObstacle({ position }: { position: [number, number, number] }) {
    return (
        <mesh position={position} receiveShadow castShadow>
            <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
            <meshStandardMaterial color="#888" />
        </mesh>
    );
}

// LiDAR Point Cloud Simulation
function LidarScanEffect() {
    const points = useRef<THREE.Points>(null);
    useFrame(({ clock }) => {
        if (points.current) {
            points.current.rotation.y = clock.getElapsedTime() * 0.1;
            // Pulse effect logic could go here
        }
    });

    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);
        const r = 4 + Math.random() * 0.5;
        positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = r * Math.cos(theta);
    }

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#00ff00" transparent opacity={0.4} sizeAttenuation />
        </points>
    );
}

export function SpatialRoomViewer({ onClose }: { onClose: () => void }) {
    const [productPos, setProductPos] = useState<[number, number, number]>([0, 0, 0]);
    const [colliding, setColliding] = useState(false);

    // Collision Logic
    useFrame(() => {
        // Obstacle at [2, 0, 2]
        // Product Box Radius ~0.7
        const obstaclePos = new THREE.Vector3(2, 0, 2);
        const currentPos = new THREE.Vector3(productPos[0], 0, productPos[2]);
        const dist = currentPos.distanceTo(obstaclePos);

        if (dist < 1.2) { // 0.5 + 0.5 + margin
            if (!colliding) {
                setColliding(true);
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100);
            }
        } else {
            if (colliding) setColliding(false);
        }
    });

    return (
        <div className="fixed inset-0 z-[60] bg-black">
            <Button
                onClick={onClose}
                className="absolute top-4 right-4 z-[70] bg-white text-black hover:bg-neutral-200"
            >
                Exit Simulation
            </Button>

            <div className="absolute top-4 left-4 z-[70] text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-green-400" /> Spatial Room Planner
                </h2>
                <p className="text-sm opacity-70">LiDAR Mesh Active • M3 GPU Optimized</p>
                {colliding && <p className="text-red-500 font-bold mt-2 animate-pulse">COLLISION DETECTED</p>}
            </div>

            <Canvas shadows camera={{ position: [0, 5, 8], fov: 50 }}>
                <Suspense fallback={null}>
                    {/* Lighting & Env */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                    <Environment preset="apartment" />
                    <LidarScanEffect />

                    {/* Room Floor */}
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -0.5, 0]}
                        receiveShadow
                        onPointerMove={(e) => {
                            // Raycast logic to move product
                            // Simplified: just passing event up would be better in real world drag impl
                            setProductPos([e.point.x, 0, e.point.z]);
                        }}
                    >
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial color="#202020" roughness={0.8} />
                        <gridHelper args={[20, 20, "#444", "#222"]} rotation={[-Math.PI / 2, 0, 0]} />
                    </mesh>

                    {/* Objects */}
                    <SimulatedProduct
                        position={productPos}
                        isColliding={colliding}
                        onPositionChange={setProductPos}
                    />

                    <RoomObstacle position={[2, 0, 2]} />
                    <RoomObstacle position={[-2, 0, -1]} />

                    <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
                    <OrbitControls makeDefault />
                </Suspense>
            </Canvas>
        </div>
    );
}
