"use client";

import { useState, useEffect } from "react";

import { createClient } from "@/lib/supabase/client"; // Corrected path
import { toast } from "sonner";

export function useAuthSecurity() {
    const supabase = createClient();
    const [factors, setFactors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch enrolled factors
    useEffect(() => {
        const fetchFactors = async () => {
            const { data, error } = await supabase.auth.mfa.listFactors();
            if (error) {
                console.error("Error fetching MFA factors:", error);
            } else {
                setFactors(data.all || []);
            }
            setLoading(false);
        };
        fetchFactors();
    }, [supabase]);

    // Enroll TOTP
    const enrollTOTP = async () => {
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
        });
        if (error) {
            toast.error(error.message);
            return null;
        }
        return data; // Contains qr_code, secret, id
    };

    // Challenge and Verify TOTP
    const verifyFactor = async (factorId: string, code: string) => {
        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) {
            toast.error(challenge.error.message);
            return false;
        }

        const verify = await supabase.auth.mfa.verify({
            factorId,
            challengeId: challenge.data.id,
            code,
        });

        if (verify.error) {
            toast.error(verify.error.message);
            return false;
        }

        toast.success("Factor Verified!");
        return true;
    };

    // Unenroll
    const unenrollFactor = async (factorId: string) => {
        const { error } = await supabase.auth.mfa.unenroll({ factorId });
        if (error) {
            toast.error(error.message);
        } else {
            setFactors(prev => prev.filter(f => f.id !== factorId));
            toast.success("Factor removed");
        }
    };

    // Passkeys (WebAuthn) - Simplified Mock for standard WebAuthn API if Supabase helper missing
    // or using Supabase's mfa.enroll with 'webauthn' ??
    // Note: Supabase JS v2 recent versions support WebAuthn registration differently.
    // For this implementation, we will mock the WebAuthn specific browser interaction 
    // if native helper isn't assumed in the current dependency version, 
    // OR use the actual `supabase.auth.mfa.enroll({ factorType: 'totp' })` as primary example.
    // Passkeys in Supabase often confusingly referred to as just MFA factors or Separate.
    // We will stick to TOTP MFA for "Zero Trust" compliance first, and mock Passkey UI if API is elusive.

    return {
        factors,
        loading,
        enrollTOTP,
        verifyFactor,
        unenrollFactor
    };
}
