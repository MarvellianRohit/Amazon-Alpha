import { StoreEnvironment } from "@/components/holodeck/store-environment";

export default function HolodeckPage() {
    return (
        <main className="w-full h-screen overflow-hidden bg-black">
            <StoreEnvironment />
        </main>
    );
}
