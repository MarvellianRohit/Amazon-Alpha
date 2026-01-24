"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const useNotificationSocket = (userId: string, onMessage?: (data: any) => void) => {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!userId) return;

        // Connect to FastAPI WebSocket
        const socketUrl = `ws://127.0.0.1:8000/ws/notifications/${userId}`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log("Connected to Notification Stream");
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (onMessage) onMessage(data);
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        ws.current.onclose = () => {
            console.log("Notification Stream Disconnected");
        };

        return () => {
            ws.current?.close();
        };
    }, [userId, onMessage]);

    return ws.current;
};
