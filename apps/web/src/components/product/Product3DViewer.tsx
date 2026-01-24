"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Html } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cuboid, Smartphone } from "lucide-react";

function Model({ url }: { url?: string }) {
    // logic to load GLTF if url exists, else show a backup box
    /* 
       Note: In a real app, useGLTF(url) would be used. 
       For this demo, we use a colorful mesh to represent the product.
    */
    const meshRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} scale={1.5}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8844ee" roughness={0.3} metalness={0.8} />
        </mesh>
    );
}

export function Product3DViewer({ modelUrl }: { modelUrl?: string }) {
    const [arMode, setArMode] = useState(false);

    return (
        <div className="relative w-full h-[400px] bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-1">
                    <Cuboid className="w-3 h-3" />
                    3D View
                </div>
            </div>

            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 4] }}>
                <Suspense fallback={<Html center>Loading 3D...</Html>}>
                    <Stage environment="city" intensity={0.6}>
                        <Model url={modelUrl} />
                    </Stage>
                    <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-4 right-4 z-10">
                <Button
                    variant="default"
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                    onClick={() => setArMode(!arMode)}
                >
                    <Smartphone className="w-4 h-4 mr-2" />
                    {arMode ? "Exit AR" : "View in Room"}
                </Button>
            </div>

            {arMode && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl max-w-sm text-center shadow-2xl">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="text-lg font-bold mb-2">AR Experience</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Point your phone at a flat surface to place this item in your room.
                        </p>
                        <Button onClick={() => setArMode(false)} variant="outline">Close Demo</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
