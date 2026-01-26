"use client";

import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ProductBox({ position, product, onSelect, isInspected }: { position: [number, number, number], product: any, onSelect: (p: any) => void, isInspected: boolean }) {
    const [hovered, setHover] = useState(false);
    const [ref, api] = useBox(() => ({ mass: 1, position, args: [1, 1, 1] }));
    // Memoize target position to avoid reallocation
    const targetPos = new THREE.Vector3(0, 10, 15);

    useFrame((state) => {
        if (isInspected) {
            // Stop physics
            api.mass.set(0);
            api.velocity.set(0, 0, 0);
            api.angularVelocity.set(0, 0, 0);

            // Read current instance position
            if (ref.current) {
                const currentPos = ref.current.position;
                currentPos.lerp(targetPos, 0.1);
                api.position.set(currentPos.x, currentPos.y, currentPos.z);

                // Slow rotation
                ref.current.rotation.y += 0.01;
                ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.5, 0.1);
                ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1);

                api.rotation.set(ref.current.rotation.x, ref.current.rotation.y, ref.current.rotation.z);
            }
        } else {
            // Restore physics
            // Optimization: Only set mass if it's not already 1 (mass is not directly readable easily without subscription, 
            // but setting it repeatedly is cheap enough in cannon-es worker, but we can skip if we want perfect optim. 
            // For now, simple is fine).
            api.mass.set(1);
        }
    });

    return (
        <mesh
            ref={ref as any}
            receiveShadow
            castShadow
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
                // Impulse on click only if not inspecting? 
                // Actually if we click to inspect, we might not want to kick it away.
                if (!isInspected) {
                    api.velocity.set(0, 2, 0);
                }
            }}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={isInspected ? "#ffffff" : (hovered ? "#ec4899" : "#ffffff")}
                roughness={0.2}
                metalness={0.1}
                emissive={hovered || isInspected ? "#ec4899" : "#000"}
                emissiveIntensity={(hovered || isInspected) ? 0.5 : 0}
            />
            {/* Visual Cue that it is a product */}
            <meshStandardMaterial attach="material-0" color={hovered || isInspected ? "#ec4899" : "#4f46e5"} /> {/* Right */}
            <meshStandardMaterial attach="material-1" color={hovered || isInspected ? "#ec4899" : "#4f46e5"} /> {/* Left */}
            <meshStandardMaterial attach="material-2" color={hovered || isInspected ? "#ec4899" : "#ffff00"} /> {/* Top */}
            <meshStandardMaterial attach="material-3" color={hovered || isInspected ? "#ec4899" : "#ffff00"} /> {/* Bottom */}
        </mesh>
    );
}
