import Link from "next/link";
import { Package, Shield, Globe, Cpu } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white border-t border-slate-800 py-20 mt-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <span className="font-black text-white italic">A</span>
                            </div>
                            <h3 className="font-black text-2xl tracking-tighter italic">AMAZON<span className="text-indigo-500">ALPHA</span></h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            The hyper-standard for next-gen trade. Engineered for humans, optimized for agents. Built on AlphaCloud.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                                <Cpu className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-indigo-500">Laboratory</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">Quantum Search</Link></li>
                            <li><Link href="/simulator" className="hover:text-white transition-colors">Holodeck AR</Link></li>
                            <li><Link href="/deals" className="hover:text-white transition-colors">Yield Optimization</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-indigo-500">Ecosystem</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/account/profile" className="hover:text-white transition-colors">User Node</Link></li>
                            <li><Link href="/orders" className="hover:text-white transition-colors">Logistics Core</Link></li>
                            <li><Link href="/wallet" className="hover:text-white transition-colors">Pay-Layer</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-indigo-500">Network Status</h4>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">API Sync</span>
                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-1 h-1 bg-green-500 animate-pulse rounded-full" /> Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Latency</span>
                                <span className="text-[10px] text-indigo-400 font-bold">24ms</span>
                            </div>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-[88%] h-full bg-indigo-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <Link href="/legal/terms" className="hover:text-indigo-400">Protocol</Link>
                        <Link href="/legal/privacy" className="hover:text-indigo-400">Enclosure</Link>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono uppercase">
                        © 2024 Amazon-Alpha // v4.2.0-secure
                    </div>
                    <div className="flex gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <Shield className="w-4 h-4" />
                        <Package className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
