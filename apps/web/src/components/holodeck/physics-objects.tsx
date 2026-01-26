"use client";

import { usePlane } from "@react-three/cannon";
import { useState } from "react";

export function Plane(props: any) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
    return (
        <mesh ref={ref as any} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} />
            <gridHelper args={[100, 100, '#ff0055', '#222']} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
    );
}


import { ProductBox } from "./product-box";

export function ProductBodies({ products, onSelect, inspectedProductId }: { products: any[], onSelect: (p: any) => void, inspectedProductId?: string }) {
    // Generate positions based on the products array length or just map them directly if they are stable.
    // Since products might load later, we should probably memoize the positions or generate them on the fly.
    // However, keeping stable positions for specific product indices is good.

    return (
        <>
            {products.map((product, i) => {
                // Deterministic position based on index
                const position: [number, number, number] = [
                    (Math.sin(i * 132.1) - 0.5) * 30,
                    20 + Math.abs(Math.cos(i * 32.2) * 40),
                    (Math.cos(i * 54.3) - 0.5) * 20
                ];

                return <ProductBox
                    key={product.id || i}
                    position={position}
                    product={product}
                    onSelect={onSelect}
                    isInspected={inspectedProductId === product.id}
                />
            })}
        </>
    );

}
