import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Amazon-Alpha</h3>
                        <p className="text-sm text-gray-500">
                            The next-gen e-commerce platform for agents and humans.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/category/electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
                            <li><Link href="/category/fashion" className="hover:text-primary transition-colors">Clothing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-12 pt-8 text-center text-sm text-gray-400">
                    © 2024 Amazon-Alpha. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
