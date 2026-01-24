"use client";

import { useState, useCallback } from "react";
import { useNotificationSocket } from "@/hooks/use-notification-socket";
import { AgentApprovalModal } from "@/components/agent/AgentApprovalModal";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider"; // Assuming auth provider exists

export function AgentNotificationProvider({ children }: { children: React.ReactNode }) {
    // In a real app, get ID from Auth Context
    // For demo, we hardcode or mock
    const { user } = useAuth() || { user: { id: "user_123" } };
    const [modalOpen, setModalOpen] = useState(false);
    const [dealData, setDealData] = useState<any>(null);

    const handleMessage = useCallback((data: any) => {
        console.log("WS Msg:", data);
        if (data.type === "DEAL_APPROVAL_NEEDED") {
            setDealData(data);
            setModalOpen(true);

            // HAPTIC TRIGGER (Samsung Tab / Mobile)
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([200, 100, 200]); // Buzz-pause-buzz
            }

            toast.message("Action Required", {
                description: `Agent found a deal for ${data.item_name} at $${data.final_price}`,
                action: {
                    label: "View",
                    onClick: () => setModalOpen(true)
                }
            });
        }
    }, []);

    useNotificationSocket(user?.id || "demo_user", handleMessage);

    const handleConfirm = async () => {
        toast.success("Deal Confirmed!", { description: "Processing payment via Stripe..." });
        setModalOpen(false);
        // Call API to finalize
        // await fetch('/api/agents/approve', ...)
    };

    return (
        <>
            {children}
            <AgentApprovalModal
                isOpen={modalOpen}
                dealData={dealData}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
}
