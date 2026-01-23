import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                About Amazon Alpha
            </h1>

            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                <p>
                    Welcome to <span className="font-semibold text-foreground">Amazon Alpha</span>, the future of e-commerce.
                    We are not just a store; we are a digital ecosystem designed to showcase the pinnacle of modern web technology.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-foreground mb-4">Our Mission</h3>
                        <p>To redefine the shopping experience through immersive design, AI-driven interactions, and blockchain transparency.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-foreground mb-4">The Tech</h3>
                        <p>Built with Next.js 14, Framer Motion, and Web3 integration, Alpha represents the bleeding edge of what's possible in a browser.</p>
                    </div>
                </div>

                <p>
                    From our 3D product visualizations to our AI-powered "Jarvis" voice assistant, every pixel is crafted to delight.
                    Whether you're minting a Digital Twin of your purchase or just browsing with "Circle to Search,"
                    we hope you enjoy the journey.
                </p>

                <div className="text-center mt-12">
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/contact">Get in Touch</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
