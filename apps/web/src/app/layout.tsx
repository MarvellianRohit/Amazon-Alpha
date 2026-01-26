import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import QueryProvider from "@/components/providers/query-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { AnimationProvider } from "@/components/providers/animation-provider";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { BottomNav } from "@/components/mobile/bottom-nav";

import Link from "next/link";
import { AIChatWidget } from "@/components/ai/chat-widget";
import { CommandMenu } from "@/components/layout/command-menu";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { AgentNotificationProvider } from "@/components/providers/agent-notification-provider";
import { SmoothScrolling } from "@/components/providers/smooth-scrolling";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amazon-Alpha",
  description: "Multi-vendor e-commerce platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Amazon Alpha",
  },
  icons: {
    apple: "/globe.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <CurrencyProvider>
              <WalletProvider>
                <CartProvider>
                  <AnimationProvider>
                    <AgentNotificationProvider>
                      <SmoothScrolling>
                        <Navbar />
                        <main className="min-h-screen pb-16 md:pb-0">
                          {children}
                        </main>
                      </SmoothScrolling>
                    </AgentNotificationProvider>
                    <div className="md:hidden">
                      <BottomNav />
                    </div>
                    <div className="hidden md:block">
                      <Footer />
                    </div>
                    <AIChatWidget />
                    <CommandMenu />
                    <CursorFollower />
                  </AnimationProvider>
                </CartProvider>
              </WalletProvider>
            </CurrencyProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
