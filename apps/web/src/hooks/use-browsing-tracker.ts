'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useBrowsingTracker(userId?: string) {
    const pathname = usePathname();
    const startTimeRef = useRef(Date.now());
    const scrollDepthRef = useRef(0);

    // Track View & Dwell Time
    useEffect(() => {
        startTimeRef.current = Date.now();
        scrollDepthRef.current = 0;

        // Log View
        logSignal({ event_type: 'view', metadata: { path: pathname } });

        return () => {
            const dwellTime = (Date.now() - startTimeRef.current) / 1000;
            const maxScroll = scrollDepthRef.current;

            // Log Dwell Time on exit
            if (dwellTime > 2) {
                logSignal({
                    event_type: 'dwell',
                    metadata: { path: pathname, duration_seconds: dwellTime, max_scroll: maxScroll }
                });
            }
        };
    }, [pathname]);

    // Track Scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollPercent > scrollDepthRef.current) {
                scrollDepthRef.current = Math.round(scrollPercent);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logSignal = async (signal: any) => {
        // In real app, batch these or use navigator.sendBeacon
        try {
            await fetch('http://localhost:8000/api/v1/signals/signals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: signal.event_type,
                    metadata: signal.metadata
                })
            });
        } catch (e) {
            // fail silently
        }
    };
}
