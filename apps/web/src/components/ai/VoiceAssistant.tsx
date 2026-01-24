"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("Hi! I'm Genie. Ask me to find products or navigate.");

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript("");
            recognitionRef.current?.start();
        }
    };

    const handleSimulateCommand = () => {
        // Determine action based on simple keywords (mock AI logic)
        const lower = transcript.toLowerCase();

        setTimeout(() => {
            if (lower.includes("navigate") || lower.includes("go to")) {
                setResponse("Navigating you there now...");
                // In real app: router.push(...)
            } else if (lower.includes("price") || lower.includes("cost")) {
                setResponse("I found 3 items matching your budget.");
            } else {
                setResponse(`Searching for "${transcript}"...`);
            }
        }, 1000);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed bottom-6 left-6 z-50"
            >
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-violet-600 shadow-xl shadow-purple-500/40 hover:scale-110 transition-transform p-0"
                >
                    <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </Button>
            </motion.div>

            {/* Assistant Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-24 left-6 z-50 w-80 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500/10 to-violet-600/10 p-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                                    AI Genie
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <div className="p-4 min-h-[150px] flex flex-col justify-end gap-3">
                            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[90%] text-sm shadow-sm">
                                {response}
                            </div>

                            {transcript && (
                                <div className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[90%] text-sm shadow-sm">
                                    {transcript}
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t border-white/10 flex items-center gap-2">
                            <Button
                                variant={isListening ? "destructive" : "secondary"}
                                size="icon"
                                className={cn("rounded-full h-12 w-12 shrink-0 transition-all", isListening && "animate-pulse ring-4 ring-red-500/20")}
                                onClick={toggleListening}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </Button>

                            {transcript && !isListening && (
                                <Button
                                    onClick={handleSimulateCommand}
                                    className="flex-1 rounded-full bg-neutral-900 dark:bg-white dark:text-black"
                                >
                                    Process <Send className="w-4 h-4 ml-2" />
                                </Button>
                            )}

                            {!transcript && !isListening && (
                                <div className="text-xs text-center flex-1 text-muted-foreground">
                                    Tap microphone to speak
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
