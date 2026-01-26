"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { OrbitControls, Environment, PerspectiveCamera, AdaptiveDpr } from "@react-three/drei";
import { Plane, ProductBodies } from "./physics-objects";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { InspectionHUD } from "./inspection-hud";

export function HolodeckScene() {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const { addItem } = useCart();

    useEffect(() => {
        apiClient<any[]>('/api/products').then(setProducts).catch(console.error);
    }, []);

    return (
        <div className="w-full h-full absolute inset-0 bg-black">
            <Canvas shadows gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
                <AdaptiveDpr pixelated />
                <PerspectiveCamera makeDefault position={[0, 10, 20]} />
                <OrbitControls maxPolarAngle={Math.PI / 2.2} enabled={!selectedProduct} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />

                {/* Physics World */}
                <Physics gravity={[0, -9.81, 0]}>
                    <Plane />
                    <ProductBodies products={products} onSelect={setSelectedProduct} inspectedProductId={selectedProduct?.id} />
                </Physics>

                {/* Post Processing */}
                <EffectComposer enableNormalPass={false}>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                    <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} radialModulation={false} modulationOffset={0} />
                    <Noise opacity={0.05} />
                </EffectComposer>

                {/* Environment */}
                <Suspense fallback={null}>
                    <Environment preset="night" />
                    <fog attach="fog" args={['#000', 10, 60]} />
                </Suspense>
            </Canvas>

            {/* Inspection HUD */}
            <InspectionHUD product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </div>
    );
}
