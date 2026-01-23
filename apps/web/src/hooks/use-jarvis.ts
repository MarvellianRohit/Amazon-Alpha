"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface JarvisState {
    isListening: boolean;
    transcript: string;
    isSpeaking: boolean;
}

export function useJarvis() {
    const router = useRouter();
    const [state, setState] = useState<JarvisState>({
        isListening: false,
        transcript: '',
        isSpeaking: false,
    });

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            setState(prev => ({ ...prev, isSpeaking: true }));
            const utterance = new SpeechSynthesisUtterance(text);

            // Try to select a "Google US English" voice or similar natural one
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const processCommand = useCallback((transcript: string) => {
        const lower = transcript.toLowerCase();

        // 1. Navigation Commands
        if (lower.includes("cart")) {
            speak("Opening your cart.");
            router.push("/cart");
        } else if (lower.includes("checkout")) {
            speak("Proceeding to checkout.");
            router.push("/checkout");
        } else if (lower.includes("orders") || lower.includes("history")) {
            speak("Showing your order history.");
            router.push("/account/orders");
        } else if (lower.includes("home")) {
            speak("Going home.");
            router.push("/");
        } else if (lower.includes("account") || lower.includes("profile")) {
            speak("Opening your profile.");
            router.push("/account");
        }
        // 2. Search Fallback
        else {
            speak(`Searching for ${transcript}`);
            router.push(`/search?q=${encodeURIComponent(transcript)}`);
        }
    }, [router, speak]);

    const toggleListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Jarvis requires Chrome or Edge.");
            return;
        }

        if (state.isListening) {
            // Manual stop, usually handled by onend
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        setState(prev => ({ ...prev, isListening: true, transcript: '' }));

        recognition.onresult = (event: any) => {
            const currentTranscript = event.results[0][0].transcript;
            setState(prev => ({ ...prev, transcript: currentTranscript }));

            if (event.results[0].isFinal) {
                processCommand(currentTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Jarvis error', event.error);
            setState(prev => ({ ...prev, isListening: false }));
            speak("I didn't catch that.");
        };

        recognition.onend = () => {
            setState(prev => ({ ...prev, isListening: false }));
        };

        recognition.start();
        speak("I'm listening.");

    }, [state.isListening, processCommand, speak]);

    return {
        ...state,
        toggleListening,
        speak
    };
}
