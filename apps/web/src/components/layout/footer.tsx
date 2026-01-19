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
                            <li>All Products</li>
                            <li>Electronics</li>
                            <li>Clothing</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Help Center</li>
                            <li>Returns</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
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
