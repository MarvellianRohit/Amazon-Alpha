import { create } from 'zustand';

interface SupernovaState {
    activeProductId: string | null;
    immersiveMode: boolean;
    setActiveProduct: (productId: string | null) => void;
    setImmersiveMode: (active: boolean) => void;
    toggleImmersiveMode: () => void;
}

export const useSupernovaStore = create<SupernovaState>((set) => ({
    activeProductId: null,
    immersiveMode: false,
    setActiveProduct: (productId) => set({ activeProductId: productId }),
    setImmersiveMode: (active) => set({ immersiveMode: active }),
    toggleImmersiveMode: () => set((state) => ({ immersiveMode: !state.immersiveMode })),
}));
